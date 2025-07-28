import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

export function createOrderRoutes(orderController: OrderController): Router {
  const router = Router();

  // POST /orders - Criar pedido
  router.post('/', (req, res) => orderController.createOrder(req, res));

  // GET /orders/:id - Buscar pedido por ID
  router.get('/:id', (req, res) => orderController.getOrder(req, res));

  // GET /orders - Buscar todos os pedidos
  router.get('/', (req, res) => orderController.getAllOrders(req, res));

  return router;
} 