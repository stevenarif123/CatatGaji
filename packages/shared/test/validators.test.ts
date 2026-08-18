import { describe, it, expect } from 'vitest';
import { validateNik, validateNpwp, validateBpjsTk, validateBpjsKes, validatePin } from '../src/validators';

describe('validateNik', () => {
  it('accepts valid 16-digit NIK (male)', () => {
    // Wilayah 320115 (6 digit), DOB 150896 = 15 Aug 1996, Seq 0001
    expect(validateNik('3201151508960001').valid).toBe(true);
  });
  it('accepts valid NIK (female, DD+40)', () => {
    // Female: day + 40, so 15 → 55
    expect(validateNik('3201155508960001').valid).toBe(true);
  });
  it('rejects too short', () => {
    expect(validateNik('320115089600').valid).toBe(false);
  });
  it('rejects non-digit', () => {
    expect(validateNik('320115089600000A').valid).toBe(false);
  });
  it('rejects invalid day (00)', () => {
    expect(validateNik('3201150008960001').valid).toBe(false);
  });
  it('rejects invalid day (32)', () => {
    expect(validateNik('3201153208960001').valid).toBe(false);
  });
  it('rejects invalid month (13)', () => {
    expect(validateNik('3201151513960001').valid).toBe(false);
  });
});

describe('validateNpwp', () => {
  it('accepts 15-digit old format', () => {
    expect(validateNpwp('012345678901234').valid).toBe(true);
  });
  it('accepts 16-digit new format (=NIK)', () => {
    expect(validateNpwp('3201150896000001').valid).toBe(true);
  });
  it('accepts dotted format', () => {
    expect(validateNpwp('01.234.567.8-901.234').valid).toBe(true);
  });
  it('rejects 14-digit', () => {
    expect(validateNpwp('01234567890123').valid).toBe(false);
  });
});

describe('validateBpjsTk', () => {
  it('accepts 11 digits', () => {
    expect(validateBpjsTk('12345678901').valid).toBe(true);
  });
  it('rejects 10 digits', () => {
    expect(validateBpjsTk('1234567890').valid).toBe(false);
  });
});

describe('validateBpjsKes', () => {
  it('accepts 13 digits', () => {
    expect(validateBpjsKes('1234567890123').valid).toBe(true);
  });
  it('rejects 12 digits', () => {
    expect(validateBpjsKes('123456789012').valid).toBe(false);
  });
});

describe('validatePin', () => {
  it('accepts 6 digits', () => {
    expect(validatePin('150896').valid).toBe(true);
  });
  it('rejects 5 digits', () => {
    expect(validatePin('15089').valid).toBe(false);
  });
  it('rejects letters', () => {
    expect(validatePin('15089A').valid).toBe(false);
  });
});
