import { describe, it, expect, beforeAll } from 'vitest';
import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { authRoutes } from '../src/routes/auth';
import { initDb } from '../src/db';

describe('Auth Integration Tests with Embedded Database', () => {
  let app: any;

  beforeAll(async () => {
    await initDb();

    app = Fastify();
    await app.register(jwt, { secret: 'test-secret-key-12345' });
    app.decorate('authenticate', async function (request: any, reply: any) {
      try {
        await request.jwtVerify();
      } catch {
        reply.code(401).send({ success: false, message: 'Unauthorized' });
      }
    });
    await app.register(authRoutes, { prefix: '/api/v1/auth' });
  });

  const testSlug = `org-test-${Date.now()}`;
  const testEmail = `owner-${Date.now()}@example.com`;
  const testPassword = 'Password123#';

  it('POST /api/v1/auth/register-tenant registers a new tenant & owner', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register-tenant',
      payload: {
        company_name: 'PT Test Mandiri',
        company_slug: testSlug,
        owner_name: 'Test Owner',
        email: testEmail,
        password: testPassword,
        phone: '081234567890',
        tier: 'STARTER',
      },
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.slug).toBe(testSlug);
    expect(body.data.tenant_id).toBeDefined();
    expect(body.data.token).toBeDefined();
  });

  it('POST /api/v1/auth/login logs in the registered owner', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: testEmail,
        password: testPassword,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.role).toBe('OWNER');
    expect(body.data.token).toBeDefined();
  });

  it('POST /api/v1/auth/login rejects wrong password', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: testEmail,
        password: 'WrongPassword!',
      },
    });

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(false);
    expect(body.error_code).toBe('INVALID_CREDENTIALS');
  });
});
