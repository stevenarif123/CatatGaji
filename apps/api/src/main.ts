import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth.js';
import { healthRoutes } from './routes/health.js';
import { branchRoutes } from './routes/branches.js';
import { employeeRoutes } from './routes/employees.js';
import { payrollRoutes } from './routes/payroll.js';
import { attendanceRoutes } from './routes/attendance.js';
import { leaveRoutes } from './routes/leave.js';
import { settingsRoutes } from './routes/settings.js';
import { initDb } from './db.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Security & Utility Plugins
  await app.register(cors, { origin: process.env.CORS_ORIGIN || 'http://localhost:5173' });
  await app.register(helmet);
  await app.register(jwt, { secret: process.env.JWT_SECRET || 'dev-secret-change-in-production' });

  // Decorators for JWT auth
  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ success: false, error_code: 'UNAUTHORIZED', message: 'Token tidak valid atau kadaluarsa.' });
    }
  });

  // Routes
  await app.register(healthRoutes);
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(branchRoutes, { prefix: '/api/v1/branches' });
  await app.register(employeeRoutes, { prefix: '/api/v1/employees' });
  await app.register(payrollRoutes, { prefix: '/api/v1/payroll' });
  await app.register(attendanceRoutes, { prefix: '/api/v1/attendance' });
  await app.register(leaveRoutes, { prefix: '/api/v1/leave' });
  await app.register(settingsRoutes, { prefix: '/api/v1/settings' });

  return app;
}

async function bootstrap() {
  try {
    // 1. Initialize embedded or external database migrations
    await initDb();

    // 2. Build Fastify app
    const app = await buildApp();

    // 3. Start server
    const PORT = parseInt(process.env.PORT || '3000', 10);
    const HOST = process.env.HOST || '0.0.0.0';

    await app.listen({ port: PORT, host: HOST });
    console.log(`\n🚀 CatatGaji API running on http://${HOST}:${PORT}\n`);
  } catch (err) {
    console.error('Error during startup:', err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  bootstrap();
}
