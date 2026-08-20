import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { withTenant } from '../db.js';

export const settingsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({
        success: false,
        error_code: 'UNAUTHORIZED',
        message: 'Token tidak valid atau telah kedaluwarsa.',
      });
    }
  });

  // --------------------------------------------------------------------------
  // 1. Get Tenant Profile & Tax Signatory Details
  // --------------------------------------------------------------------------
  app.get('/profile', async (request: any) => {
    const { tenant_id } = request.user;

    const profile = await withTenant(tenant_id, async (sql) => {
      const [tenant] = await sql`
        SELECT 
          id, name as company_name, slug as company_slug, tier,
          npwp_badan, address, city, postal_code,
          tax_signatory_name, tax_signatory_nik, tax_signatory_npwp,
          logo_url, created_at
        FROM tenants
        WHERE id = ${tenant_id}
      `;
      return tenant;
    });

    return { success: true, data: profile };
  });

  // --------------------------------------------------------------------------
  // 2. Update Tenant Profile & Tax Signatory Details
  // --------------------------------------------------------------------------
  app.put('/profile', async (request: any, reply) => {
    const { tenant_id } = request.user;
    const {
      company_name,
      npwp_badan,
      address,
      city,
      postal_code,
      tax_signatory_name,
      tax_signatory_nik,
      tax_signatory_npwp,
      logo_url,
    } = request.body || {};

    if (!company_name) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Nama perusahaan wajib diisi.',
      });
    }

    const updated = await withTenant(tenant_id, async (sql) => {
      const [res] = await sql`
        UPDATE tenants SET
          name = ${company_name},
          npwp_badan = ${npwp_badan || null},
          address = ${address || null},
          city = ${city || null},
          postal_code = ${postal_code || null},
          tax_signatory_name = ${tax_signatory_name || null},
          tax_signatory_nik = ${tax_signatory_nik || null},
          tax_signatory_npwp = ${tax_signatory_npwp || null},
          logo_url = ${logo_url || null},
          updated_at = NOW()
        WHERE id = ${tenant_id}
        RETURNING 
          id, name as company_name, slug as company_slug, tier,
          npwp_badan, address, city, postal_code,
          tax_signatory_name, tax_signatory_nik, tax_signatory_npwp,
          logo_url, updated_at
      `;
      return res;
    });

    return reply.send({
      success: true,
      message: 'Profil perusahaan & identitas pemotong pajak berhasil diperbarui.',
      data: updated,
    });
  });

  // --------------------------------------------------------------------------
  // 3. Change Owner 6-Digit PIN
  // --------------------------------------------------------------------------
  app.put('/change-pin', async (request: any, reply) => {
    const { tenant_id, user_id } = request.user;
    const { old_pin, new_pin } = request.body || {};

    if (!new_pin || new_pin.length !== 6 || !/^\d{6}$/.test(new_pin)) {
      return reply.code(400).send({
        success: false,
        error_code: 'INVALID_PIN',
        message: 'PIN baru harus tepat 6 digit angka.',
      });
    }

    await withTenant(tenant_id, async (sql) => {
      const [user] = await sql`SELECT pin_hash FROM users WHERE id = ${user_id} AND tenant_id = ${tenant_id}`;
      if (!user) throw new Error('Pengguna tidak ditemukan.');

      if (user.pin_hash && old_pin) {
        const isMatch = await bcrypt.compare(old_pin, user.pin_hash);
        if (!isMatch) {
          throw new Error('PIN lama yang Anda masukkan salah.');
        }
      }

      const newPinHash = await bcrypt.hash(new_pin, 10);
      await sql`
        UPDATE users SET
          pin_hash = ${newPinHash},
          updated_at = NOW()
        WHERE id = ${user_id}
      `;
    });

    return reply.send({
      success: true,
      message: 'PIN pengesahan payroll 6-digit berhasil diperbarui.',
    });
  });
};
