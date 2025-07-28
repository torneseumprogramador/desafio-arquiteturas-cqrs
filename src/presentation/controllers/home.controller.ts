import { Request, Response } from 'express';

export class HomeController {
  async getHome(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      message: '🛒 Ecommerce CQRS API',
      version: '1.0.0',
      description: 'API de e-commerce usando arquitetura CQRS com Node.js e TypeScript',
      endpoints: {
        users: {
          'POST /api/users': 'Criar usuário',
          'GET /api/users': 'Listar todos os usuários',
          'GET /api/users/:id': 'Buscar usuário por ID',
          'PUT /api/users/:id': 'Atualizar usuário',
          'DELETE /api/users/:id': 'Deletar usuário',
        },
        products: {
          'POST /api/products': 'Criar produto',
          'GET /api/products': 'Listar todos os produtos',
          'GET /api/products/:id': 'Buscar produto por ID',
          'PUT /api/products/:id': 'Atualizar produto',
          'DELETE /api/products/:id': 'Deletar produto',
        },
        orders: {
          'POST /api/orders': 'Criar pedido',
          'GET /api/orders': 'Listar todos os pedidos',
          'GET /api/orders/:id': 'Buscar pedido por ID',
        },
        health: {
          'GET /health': 'Status da aplicação',
        },
      },
      technologies: [
        'Node.js',
        'TypeScript',
        'Express',
        'Drizzle ORM',
        'PostgreSQL',
        'CQRS Architecture',
      ],
      documentation: {
        swagger: '/swagger-ui.html',
        openapi: '/v3/api-docs',
      },
    });
  }
} 