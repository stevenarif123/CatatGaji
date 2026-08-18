import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import { healthRoutes } from '../src/routes/health';

describe('Health Routes', () => {
  it('GET /health returns 200 with success status', async () => {
    const app = Fastify();
    await app.register(healthRoutes);

    const res = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.message).toBe('CatatGaji API is running');
    expect(body.data.version).toBe('0.1.0');
  });
});
