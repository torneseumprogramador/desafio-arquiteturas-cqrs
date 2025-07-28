import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // POST /users - Criar usuário
  router.post('/', (req, res) => userController.createUser(req, res));

  // GET /users/:id - Buscar usuário por ID
  router.get('/:id', (req, res) => userController.getUser(req, res));

  // GET /users - Buscar todos os usuários
  router.get('/', (req, res) => userController.getAllUsers(req, res));

  return router;
} 