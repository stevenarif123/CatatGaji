import type { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { v7 as uuidv7 } from 'uuid';
import { sql } from '../db.js';
import { validateEmail } from '@catatgaji/shared';

export const authRoutes: FastifyPluginAsync = async (app) => {
  /**
   * POST /api/v1/auth/register-tenant
   * PRD 08 Endpoint #1: Register organisasi baru + akun owner
   */
  app.post('/register-tenant', async (request, reply) => {
    const { company_name, company_slug, owner_name, email, password, phone, tier, pin } = request.body as any;

    // Validate
    if (!company_name || !company_slug || !owner_name || !email || !password) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_FAILED',
        message: 'Field wajib tidak lengkap.',
        errors: [
          ...(!company_name ? [{ field: 'company_name', message: 'Nama perusahaan wajib diisi' }] : []),
          ...(!company_slug ? [{ field: 'company_slug', message: 'Slug perusahaan wajib diisi' }] : []),
          ...(!owner_name ? [{ field: 'owner_name', message: 'Nama owner wajib diisi' }] : []),
          ...(!email ? [{ field: 'email', message: 'Email wajib diisi' }] : []),
          ...(!password ? [{ field: 'password', message: 'Password wajib diisi' }] : []),
        ],
      });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return reply.code(400).send({
        success: false, error_code: 'VALIDATION_FAILED',
        message: emailCheck.error,
      });
    }

    // Check slug uniqueness
    const [existing] = await sql`SELECT id FROM tenants WHERE slug = ${company_slug}`;
    if (existing) {
      return reply.code(409).send({
        success: false, error_code: 'SLUG_TAKEN',
        message: `Subdomain "${company_slug}" sudah digunakan.`,
      });
    }

    const tenantId = uuidv7();
    const userId = uuidv7();
    const passwordHash = await bcrypt.hash(password, 12);
    const pinHash = pin ? await bcrypt.hash(pin, 10) : null;

    await sql.begin(async (tx) => {
      // Create tenant
      await tx`
        INSERT INTO tenants (id, name, slug, tier, settings, created_at, updated_at)
        VALUES (
          ${tenantId}, ${company_name}, ${company_slug},
          ${tier || 'STARTER'},
          ${JSON.stringify({
            max_employees: tier === 'BUSINESS' ? 500 : tier === 'GROWTH' ? 100 : 25,
            overtime_calculation_enabled: true,
            pph21_method: 'TER_MONTHLY',
          })}::jsonb,
          NOW(), NOW()
        )
      `;

      // Create owner role
      const roleId = uuidv7();
      await tx`
        INSERT INTO roles_permissions (id, tenant_id, role_name, permissions)
        VALUES (${roleId}, ${tenantId}, 'OWNER', ${JSON.stringify(['*'])}::jsonb)
      `;

      // Create owner user
      await tx`
        INSERT INTO users (id, tenant_id, email, password_hash, pin_hash, full_name, phone, role_id, is_active, created_at, updated_at)
        VALUES (${userId}, ${tenantId}, ${email}, ${passwordHash}, ${pinHash}, ${owner_name}, ${phone || null}, ${roleId}, true, NOW(), NOW())
      `;
    });

    // Generate JWT
    const token = app.jwt.sign(
      { user_id: userId, tenant_id: tenantId, role: 'OWNER' },
      { expiresIn: '7d' },
    );

    return reply.code(201).send({
      success: true,
      message: 'Organisasi dan akun owner berhasil didaftarkan.',
      data: { tenant_id: tenantId, user_id: userId, slug: company_slug, token },
    });
  });

  /**
   * POST /api/v1/auth/set-pin
   * Set or update user 6-digit approval PIN
   */
  app.post('/set-pin', { preHandler: [(app as any).authenticate] }, async (request, reply) => {
    const user = (request as any).user as { user_id: string };
    const { pin } = request.body as { pin: string };

    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      return reply.code(400).send({
        success: false,
        error_code: 'INVALID_PIN',
        message: 'PIN harus berupa 6 digit angka.',
      });
    }

    const pinHash = await bcrypt.hash(pin, 10);
    await sql`UPDATE users SET pin_hash = ${pinHash}, updated_at = NOW() WHERE id = ${user.user_id}`;

    return reply.send({
      success: true,
      message: 'PIN persetujuan berhasil diperbarui.',
    });
  });

  /**
   * POST /api/v1/auth/login
   * PRD 08 Endpoint #2: Login → JWT
   */
  app.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;

    if (!email || !password) {
      return reply.code(400).send({
        success: false, error_code: 'VALIDATION_FAILED',
        message: 'Email dan password wajib diisi.',
      });
    }

    const [user] = await sql`
      SELECT u.id, u.tenant_id, u.password_hash, u.is_active, r.role_name
      FROM users u
      JOIN roles_permissions r ON r.id = u.role_id
      WHERE u.email = ${email}
    `;

    if (!user || !user.is_active) {
      return reply.code(401).send({
        success: false, error_code: 'INVALID_CREDENTIALS',
        message: 'Email atau password salah.',
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return reply.code(401).send({
        success: false, error_code: 'INVALID_CREDENTIALS',
        message: 'Email atau password salah.',
      });
    }

    // Update last login
    await sql`UPDATE users SET last_login_at = NOW() WHERE id = ${user.id}`;

    const token = app.jwt.sign(
      { user_id: user.id, tenant_id: user.tenant_id, role: user.role_name },
      { expiresIn: '7d' },
    );

    return reply.code(200).send({
      success: true,
      message: 'Login berhasil.',
      data: {
        user_id: user.id,
        tenant_id: user.tenant_id,
        role: user.role_name,
        token,
      },
    });
  });
};
