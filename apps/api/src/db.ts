import { PGlite } from '@electric-sql/pglite';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', '..', '..', '.data', 'postgres');

export interface SqlClient {
  <T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]>;
  begin<T>(callback: (tx: SqlClient) => Promise<T>): Promise<T>;
}

let pgliteInstance: PGlite | null = null;
let postgresClient: postgres.Sql | null = null;

const useExternalDb = !!process.env.DATABASE_URL && !process.env.USE_EMBEDDED_DB;

if (useExternalDb) {
  postgresClient = postgres(process.env.DATABASE_URL!, {
    max: 20,
    idle_timeout: 20,
    connect_timeout: 10,
    transform: { undefined: null },
  });
} else if (process.env.NODE_ENV === 'test') {
  // In-memory instance for parallel vitest workers
  pgliteInstance = new PGlite();
} else {
  // Persisted on disk for dev/local execution
  fs.mkdirSync(DATA_DIR, { recursive: true });
  pgliteInstance = new PGlite(DATA_DIR);
}

/**
 * Creates a tagged template query executor around any query-capable object
 */
function createPgliteTagged(target: { query: (q: string, p?: any[]) => Promise<any> }): SqlClient {
  const executor = (async <T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]> => {
    if (pgliteInstance) {
      await pgliteInstance.waitReady;
    }
    let queryText = '';
    const params: any[] = [];

    for (let i = 0; i < strings.length; i++) {
      queryText += strings[i];
      if (i < values.length) {
        params.push(values[i]);
        queryText += `$${params.length}`;
      }
    }

    const result = await target.query(queryText, params);
    return (result.rows || []) as T[];
  }) as any;

  executor.begin = async function <T>(callback: (tx: SqlClient) => Promise<T>): Promise<T> {
    if (pgliteInstance) {
      await pgliteInstance.waitReady;
      return pgliteInstance.transaction(async (tx) => {
        const txTagged = createPgliteTagged(tx);
        return callback(txTagged);
      });
    }
    return callback(executor);
  };

  return executor;
}

export const sql: SqlClient = postgresClient
  ? ((async <T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]> => {
      return (await (postgresClient as any)(strings, ...values)) as T[];
    }) as any)
  : createPgliteTagged(pgliteInstance!);

if (postgresClient) {
  (sql as any).begin = async function <T>(callback: (tx: SqlClient) => Promise<T>): Promise<T> {
    return (await (postgresClient as any).begin(callback as any)) as T;
  };
}

/**
 * Initialize database migrations automatically on startup
 */
export async function initDb() {
  if (pgliteInstance) {
    await pgliteInstance.waitReady;
  }
  const migrationsDir = path.join(__dirname, 'database', 'migrations');
  if (!fs.existsSync(migrationsDir)) return;

  // 1. Ensure schema_migrations table exists
  if (pgliteInstance) {
    await pgliteInstance.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  } else if (postgresClient) {
    await (postgresClient as any).unsafe(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  // 2. Fetch applied migrations
  let applied: string[] = [];
  if (pgliteInstance) {
    const res = await pgliteInstance.query(`SELECT name FROM schema_migrations`);
    applied = (res.rows || []).map((r: any) => r.name);
  } else if (postgresClient) {
    const res = await (postgresClient as any).unsafe(`SELECT name FROM schema_migrations`);
    applied = (res || []).map((r: any) => r.name);
  }

  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    if (applied.includes(file)) {
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const migrationSql = fs.readFileSync(filePath, 'utf8');

    if (pgliteInstance) {
      try {
        await pgliteInstance.exec(migrationSql);
        await pgliteInstance.query(`INSERT INTO schema_migrations (name) VALUES ($1)`, [file]);
        console.log(`✅ [Embedded Database] Migrasi ${file} berhasil diterapkan`);
      } catch (err: any) {
        console.error(`❌ [Embedded Database] Gagal menerapkan migrasi ${file}:`, err);
        throw err;
      }
    } else if (postgresClient) {
      try {
        await (postgresClient as any).unsafe(migrationSql);
        await (postgresClient as any).unsafe(`INSERT INTO schema_migrations (name) VALUES ($1)`, [file]);
        console.log(`✅ [Postgres Database] Migrasi ${file} berhasil diterapkan`);
      } catch (err: any) {
        console.error(`❌ [Postgres Database] Gagal menerapkan migrasi ${file}:`, err);
        throw err;
      }
    }
  }
}

/**
 * Set tenant context for RLS
 */
export async function setTenantContext(tenantId: string) {
  if (postgresClient) {
    await sql`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`;
  } else if (pgliteInstance) {
    await pgliteInstance.query(`SELECT set_config('app.current_tenant_id', $1, true)`, [tenantId]);
  }
}

/**
 * Run a callback within a transaction with tenant context set.
 */
export async function withTenant<T>(
  tenantId: string,
  fn: (sqlClient: SqlClient) => Promise<T>
): Promise<T> {
  return sql.begin(async (tx) => {
    await tx`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`;
    return fn(tx);
  });
}
