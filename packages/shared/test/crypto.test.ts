import { describe, it, expect } from 'vitest';
import { encryptLocalData, decryptLocalData } from '../src';

describe('Web Crypto API — AES-256-GCM Local Database Encryption', () => {
  const passphrase = 'user-secret-pin-passphrase-2026';

  it('Encrypts and decrypts sensitive employee payload accurately', async () => {
    const sensitivePayload = {
      nik_ktp: '3171010101900001',
      full_name: 'Budi Santoso',
      basic_salary: 8500000,
      bank_account_no: '1234567890',
    };

    const encrypted = await encryptLocalData(sensitivePayload, passphrase);
    expect(typeof encrypted).toBe('string');
    expect(encrypted).not.toContain('3171010101900001');
    expect(encrypted).not.toContain('8500000');

    const decrypted = await decryptLocalData<typeof sensitivePayload>(encrypted, passphrase);
    expect(decrypted.nik_ktp).toBe(sensitivePayload.nik_ktp);
    expect(decrypted.full_name).toBe(sensitivePayload.full_name);
    expect(decrypted.basic_salary).toBe(sensitivePayload.basic_salary);
    expect(decrypted.bank_account_no).toBe(sensitivePayload.bank_account_no);
  });

  it('Rejects decryption with wrong passphrase', async () => {
    const encrypted = await encryptLocalData({ data: 'Confidential' }, passphrase);
    await expect(decryptLocalData(encrypted, 'wrong-passphrase')).rejects.toThrow();
  });
});
