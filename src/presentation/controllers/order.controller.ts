import { Request, Response } from 'express';
import { CreateOrderHandler } from '../../application/commands/orders/create-order.handler';
import { GetOrderHandler } from '../../application/queries/orders/get-order.handler';
import { GetAllOrdersHandler } from '../../application/queries/orders/get-all-orders.handler';
import { CreateOrderCommand } from '../../application/commands/orders/create-order.command';
import { GetOrderQuery } from '../../application/queries/orders/get-order.query';
import { GetAllOrdersQuery } from '../../application/queries/orders/get-all-orders.query';

export class OrderController {
  constructor(
    private createOrderHandler: CreateOrderHandler,
    private getOrderHandler: GetOrderHandler,
    private getAllOrdersHandler: GetAllOrdersHandler
  ) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { userId, products } = req.body;

      if (!userId || !products || !Array.isArray(products) || products.length === 0) {
        res.status(400).json({ error: 'userId e products são obrigatórios. products deve ser um array não vazio' });
        return;
      }

      const command: CreateOrderCommand = {
        userId,
        products,
      };

      const order = await this.createOrderHandler.execute(command);

      res.status(201).json({
        message: 'Pedido criado com sucesso',
        order: {
          id: order.id,
          userId: order.userId,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID do pedido é obrigatório' });
        return;
      }

      const query: GetOrderQuery = { id };
      const order = await this.getOrderHandler.execute(query);

      if (!order) {
        res.status(404).json({ error: 'Pedido não encontrado' });
        return;
      }

      res.status(200).json({
        order: {
          id: order.id,
          userId: order.userId,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const query: GetAllOrdersQuery = {};
      const orders = await this.getAllOrdersHandler.execute(query);

      res.status(200).json({
        orders: orders.map(order => ({
          id: order.id,
          userId: order.userId,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        })),
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 