import type { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', async () => ({
    success: true,
    message: 'CatatGaji API is running',
    data: { timestamp: new Date().toISOString(), version: '0.1.0' },
  }));
};
