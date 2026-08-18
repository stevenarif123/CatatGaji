import type { FastifyPluginAsync } from 'fastify';
import { v7 as uuidv7 } from 'uuid';
import { sql } from '../db.js';

export const branchRoutes: FastifyPluginAsync = async (app) => {
  // Require authentication for all branch routes
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.code(401).send({
        success: false,
        error_code: 'UNAUTHORIZED',
        message: 'Token tidak valid atau kadaluarsa.',
      });
    }
  });

  /**
   * GET /api/v1/branches
   * Get all branches & departments for the current tenant
   */
  app.get('/', async (request) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;

    const rows = await sql`
      SELECT id, name, type, code, address, latitude, longitude, radius_meters, created_at
      FROM branches_departments
      WHERE tenant_id = ${tenantId}
      ORDER BY name ASC
    `;

    return {
      success: true,
      data: rows,
    };
  });

  /**
   * POST /api/v1/branches
   * Create a new branch or department
   */
  app.post('/', async (request, reply) => {
    const user = (request as any).user;
    const tenantId = user.tenant_id;
    const { name, type, code, address, latitude, longitude, radius_meters } = request.body as any;

    if (!name || !code) {
      return reply.code(400).send({
        success: false,
        error_code: 'VALIDATION_FAILED',
        message: 'Nama dan kode unit/cabang wajib diisi.',
      });
    }

    const id = uuidv7();

    await sql`
      INSERT INTO branches_departments (
        id, tenant_id, name, type, code, address, latitude, longitude, radius_meters, created_at, updated_at
      ) VALUES (
        ${id}, ${tenantId}, ${name}, ${type || 'BRANCH'}, ${code},
        ${address || null}, ${latitude || null}, ${longitude || null},
        ${radius_meters || 100}, NOW(), NOW()
      )
    `;

    return reply.code(201).send({
      success: true,
      message: 'Cabang/Departemen berhasil ditambahkan.',
      data: { id, name, code, type: type || 'BRANCH' },
    });
  });
};
