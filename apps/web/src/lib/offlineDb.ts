import Dexie, { type EntityTable } from 'dexie';
import { encryptLocalData, decryptLocalData } from '@catatgaji/shared';

export interface LocalEmployeeRecord {
  id: string;
  tenant_id: string;
  encrypted_data: string;
  updated_at: number;
  synced: boolean;
}

export interface LocalPayrollDraftRecord {
  id: string;
  tenant_id: string;
  period_year: number;
  period_month: number;
  encrypted_data: string;
  updated_at: number;
  synced: boolean;
}

export interface SyncQueueItem {
  id?: number;
  action: 'CREATE_EMPLOYEE' | 'UPDATE_SALARY' | 'SAVE_PAYROLL_DRAFT';
  endpoint: string;
  method: 'POST' | 'PUT';
  encrypted_payload: string;
  timestamp: number;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}

class CatatGajiOfflineDB extends Dexie {
  localEmployees!: EntityTable<LocalEmployeeRecord, 'id'>;
  localPayrollDrafts!: EntityTable<LocalPayrollDraftRecord, 'id'>;
  syncQueue!: EntityTable<SyncQueueItem, 'id'>;

  constructor() {
    super('CatatGajiOfflineDB');
    this.version(1).stores({
      localEmployees: 'id, tenant_id, updated_at, synced',
      localPayrollDrafts: 'id, tenant_id, period_year, period_month, updated_at, synced',
      syncQueue: '++id, action, timestamp, status',
    });
  }
}

export const offlineDb = new CatatGajiOfflineDB();

const LOCAL_STORAGE_PASSKEY = 'catatgaji_local_dexie_secure_key_2026';

/**
 * Save employee data locally with AES-256-GCM encryption
 */
export async function saveEmployeeLocally(tenantId: string, employee: any): Promise<void> {
  const encrypted = await encryptLocalData(employee, LOCAL_STORAGE_PASSKEY);
  await offlineDb.localEmployees.put({
    id: employee.id,
    tenant_id: tenantId,
    encrypted_data: encrypted,
    updated_at: Date.now(),
    synced: true,
  });
}

/**
 * Retrieve decrypted employees from local Dexie storage
 */
export async function getLocalEmployees(tenantId: string): Promise<any[]> {
  const records = await offlineDb.localEmployees.where('tenant_id').equals(tenantId).toArray();
  const decryptedList = [];
  for (const rec of records) {
    try {
      const data = await decryptLocalData(rec.encrypted_data, LOCAL_STORAGE_PASSKEY);
      decryptedList.push(data);
    } catch {
      // Ignored corrupted or non-matching passkey
    }
  }
  return decryptedList;
}

/**
 * Save payroll draft locally with AES-256-GCM encryption
 */
export async function savePayrollDraftLocally(tenantId: string, draft: any): Promise<void> {
  const encrypted = await encryptLocalData(draft, LOCAL_STORAGE_PASSKEY);
  await offlineDb.localPayrollDrafts.put({
    id: draft.id,
    tenant_id: tenantId,
    period_year: draft.period_year,
    period_month: draft.period_month,
    encrypted_data: encrypted,
    updated_at: Date.now(),
    synced: false,
  });
}

/**
 * Queue an offline mutation for synchronization when network reconnects
 */
export async function queueOfflineAction(
  action: SyncQueueItem['action'],
  endpoint: string,
  method: SyncQueueItem['method'],
  payload: any
): Promise<void> {
  const encrypted = await encryptLocalData(payload, LOCAL_STORAGE_PASSKEY);
  await offlineDb.syncQueue.add({
    action,
    endpoint,
    method,
    encrypted_payload: encrypted,
    timestamp: Date.now(),
    status: 'PENDING',
  });
}
