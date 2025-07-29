import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

export function createHealthRoutes(healthController: HealthController): Router {
  const router = Router();

  // GET /health - Health check geral
  router.get('/', (req, res) => healthController.healthCheck(req, res));

  // GET /health/ping - Teste simples de conectividade
  router.get('/ping', (req, res) => healthController.ping(req, res));

  // GET /health/database - Health check do banco de dados
  router.get('/database', (req, res) => healthController.databaseHealth(req, res));

  // GET /health/detailed - Health check detalhado
  router.get('/detailed', (req, res) => healthController.detailedHealth(req, res));

  return router;
} 