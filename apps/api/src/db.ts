import { PGlite } from '@electric-sql/pglite';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(process.cwd(), '.data', 'postgres');

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
  const migrationsDir = path.join(__dirname, 'database', 'migrations');
  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const migrationSql = fs.readFileSync(filePath, 'utf8');
      if (pgliteInstance) {
        try {
          await pgliteInstance.exec(migrationSql);
          console.log(`✅ [Embedded Database] Migrasi ${file} berhasil diterapkan`);
        } catch (err: any) {
          if (!err.message?.includes('already exists')) {
            console.warn(`⚠️ [Embedded Database] Migration ${file} info:`, err.message);
          }
        }
      } else if (postgresClient) {
        try {
          await (postgresClient as any).unsafe(migrationSql);
        } catch (err: any) {
          if (!err.message?.includes('already exists')) {
            console.warn(`⚠️ [Postgres Database] Migration ${file} info:`, err.message);
          }
        }
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
