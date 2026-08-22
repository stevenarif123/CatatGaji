import path from 'path';
import fs from 'fs';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import { authRoutes } from './routes/auth.js';
import { healthRoutes } from './routes/health.js';
import { branchRoutes } from './routes/branches.js';
import { employeeRoutes } from './routes/employees.js';
import { payrollRoutes } from './routes/payroll.js';
import { attendanceRoutes } from './routes/attendance.js';
import { leaveRoutes } from './routes/leave.js';
import { settingsRoutes } from './routes/settings.js';
import { approvalRoutes } from './routes/approvals.js';
import { initDb } from './db.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Security & Utility Plugins
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN
      ? (origin, cb) => {
          if (!origin) return cb(null, true);
          const cleanOrigin = origin.replace(/\/$/, '');
          const allowed = process.env.CORS_ORIGIN!
            .split(',')
            .map((s) => s.trim().replace(/\/$/, ''));
          if (allowed.includes('*') || allowed.includes(cleanOrigin)) {
            cb(null, true);
          } else {
            cb(null, true); // Allow same-origin or pass-through
          }
        }
      : true,
    credentials: true,
  });
  await app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  });
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
  await app.register(approvalRoutes, { prefix: '/api/v1/approvals' });

  // Static files for Frontend SPA (Hostinger / Production All-in-One Deployment)
  const candidatePaths = [
    process.env.STATIC_PATH,
    path.resolve(process.cwd(), '../web/dist'),
    path.resolve(process.cwd(), 'apps/web/dist'),
    path.resolve(process.cwd(), 'dist/public'),
    path.resolve(process.cwd(), 'public'),
    fs.existsSync(path.join(process.cwd(), 'index.html')) ? process.cwd() : null,
  ].filter(Boolean) as string[];

  const staticDir = candidatePaths.find((p) => fs.existsSync(p));

  if (staticDir) {
    await app.register(fastifyStatic, {
      root: staticDir,
      prefix: '/',
      wildcard: true,
    });

    app.setNotFoundHandler((request, reply) => {
      const url = request.raw.url || '';
      if (url.startsWith('/api')) {
        reply.code(404).send({ success: false, error_code: 'NOT_FOUND', message: 'Endpoint API tidak ditemukan.' });
      } else if (url.startsWith('/assets/')) {
        reply.code(404).type('text/plain').send('File aset tidak ditemukan.');
      } else {
        reply.sendFile('index.html');
      }
    });
  }

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
