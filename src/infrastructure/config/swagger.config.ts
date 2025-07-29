import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'CQRS Ecommerce API',
    version: '1.0.0',
    description: 'API de e-commerce implementada com padrão CQRS (Command Query Responsibility Segregation)',
    contact: {
      name: 'Danilo Aparecido',
      url: 'https://www.torneseumprogramador.com.br',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  tags: [
    {
      name: 'Home',
      description: 'Endpoints de informações da API',
    },
    {
      name: 'Health',
      description: 'Endpoints de verificação de saúde da aplicação',
    },
    {
      name: 'Users',
      description: 'Operações CRUD para usuários',
    },
    {
      name: 'Products',
      description: 'Operações CRUD para produtos',
    },
    {
      name: 'Orders',
      description: 'Operações CRUD para pedidos',
    },
  ],
  paths: {
    '/': {
      get: {
        tags: ['Home'],
        summary: 'Informações da API',
        description: 'Retorna informações sobre a API, tecnologias utilizadas e endpoints disponíveis',
        responses: {
          '200': {
            description: 'Informações da API',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    version: { type: 'string' },
                    technologies: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    endpoints: {
                      type: 'object',
                      properties: {
                        users: { type: 'string' },
                        products: { type: 'string' },
                        orders: { type: 'string' },
                        health: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health Check Geral',
        description: 'Verifica o status geral da aplicação e banco de dados',
        responses: {
          '200': {
            description: 'Aplicação saudável',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    details: {
                      type: 'object',
                      properties: {
                        application: { type: 'string' },
                        timestamp: { type: 'string' },
                        database: {
                          type: 'object',
                          properties: {
                            status: { type: 'string' },
                            database: { type: 'string' },
                            driver: { type: 'string' },
                            version: { type: 'string' },
                            url: { type: 'string' },
                            username: { type: 'string' },
                            queryTest: { type: 'string' },
                            timestamp: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '503': {
            description: 'Aplicação com problemas',
          },
        },
      },
    },
    '/health/ping': {
      get: {
        tags: ['Health'],
        summary: 'Ping',
        description: 'Teste simples de conectividade',
        responses: {
          '200': {
            description: 'Ping bem-sucedido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    timestamp: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/health/database': {
      get: {
        tags: ['Health'],
        summary: 'Health Check do Banco',
        description: 'Verifica especificamente o status do banco de dados',
        responses: {
          '200': {
            description: 'Banco de dados saudável',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    database: { type: 'string' },
                    driver: { type: 'string' },
                    version: { type: 'string' },
                    url: { type: 'string' },
                    username: { type: 'string' },
                    queryTest: { type: 'string' },
                    timestamp: { type: 'string' },
                  },
                },
              },
            },
          },
          '503': {
            description: 'Banco de dados com problemas',
          },
        },
      },
    },
    '/health/detailed': {
      get: {
        tags: ['Health'],
        summary: 'Health Check Detalhado',
        description: 'Verificação detalhada de todos os componentes da aplicação',
        responses: {
          '200': {
            description: 'Status detalhado da aplicação',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    timestamp: { type: 'string' },
                    components: {
                      type: 'object',
                      properties: {
                        application: {
                          type: 'object',
                          properties: {
                            status: { type: 'string' },
                            name: { type: 'string' },
                            version: { type: 'string' },
                            environment: { type: 'string' },
                          },
                        },
                        database: { type: 'object' },
                        memory: {
                          type: 'object',
                          properties: {
                            status: { type: 'string' },
                            rss: { type: 'string' },
                            heapTotal: { type: 'string' },
                            heapUsed: { type: 'string' },
                            external: { type: 'string' },
                          },
                        },
                        uptime: {
                          type: 'object',
                          properties: {
                            status: { type: 'string' },
                            uptime: { type: 'string' },
                            uptimeSeconds: { type: 'number' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '503': {
            description: 'Aplicação com problemas',
          },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Listar Usuários',
        description: 'Retorna todos os usuários cadastrados com filtros e paginação',
        parameters: [
          {
            name: 'name',
            in: 'query',
            description: 'Filtrar por nome (busca parcial)',
            schema: { type: 'string' },
          },
          {
            name: 'page',
            in: 'query',
            description: 'Número da página (padrão: 1)',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Quantidade de itens por página (padrão: 10)',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': {
            description: 'Lista de usuários com paginação',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          email: { type: 'string' },
                          createdAt: { type: 'string' },
                          updatedAt: { type: 'string' },
                        },
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                        totalPages: { type: 'integer' },
                        hasNext: { type: 'boolean' },
                        hasPrev: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Criar Usuário',
        description: 'Cria um novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', format: 'email', example: 'joao@email.com' },
                  password: { type: 'string', example: 'senha123' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
          },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Buscar Usuário por ID',
        description: 'Retorna um usuário específico pelo ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do usuário',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Usuário encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Usuário não encontrado',
          },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Atualizar Usuário',
        description: 'Atualiza um usuário existente',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do usuário',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'João Silva Atualizado' },
                  email: { type: 'string', format: 'email', example: 'joao.novo@email.com' },
                  password: { type: 'string', example: 'novaSenha123' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Usuário atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Usuário não encontrado',
          },
          '400': {
            description: 'Dados inválidos',
          },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Deletar Usuário',
        description: 'Remove um usuário do sistema',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do usuário',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Usuário deletado com sucesso',
          },
          '404': {
            description: 'Usuário não encontrado',
          },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Listar Produtos',
        description: 'Retorna todos os produtos cadastrados com filtros e paginação',
        parameters: [
          {
            name: 'name',
            in: 'query',
            description: 'Filtrar por nome (busca parcial)',
            schema: { type: 'string' },
          },
          {
            name: 'page',
            in: 'query',
            description: 'Número da página (padrão: 1)',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Quantidade de itens por página (padrão: 10)',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': {
            description: 'Lista de produtos com paginação',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          description: { type: 'string' },
                          price: { type: 'number' },
                          stock: { type: 'number' },
                          createdAt: { type: 'string' },
                          updatedAt: { type: 'string' },
                        },
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                        totalPages: { type: 'integer' },
                        hasNext: { type: 'boolean' },
                        hasPrev: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Criar Produto',
        description: 'Cria um novo produto',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'price', 'stock'],
                properties: {
                  name: { type: 'string', example: 'iPhone 15' },
                  description: { type: 'string', example: 'Smartphone Apple iPhone 15' },
                  price: { type: 'number', example: 5999.99 },
                  stock: { type: 'number', example: 50 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Produto criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    stock: { type: 'number' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
          },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Buscar Produto por ID',
        description: 'Retorna um produto específico pelo ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do produto',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Produto encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    stock: { type: 'number' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Produto não encontrado',
          },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Atualizar Produto',
        description: 'Atualiza um produto existente',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do produto',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'iPhone 15 Pro' },
                  description: { type: 'string', example: 'Smartphone Apple iPhone 15 Pro' },
                  price: { type: 'number', example: 6999.99 },
                  stock: { type: 'number', example: 30 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Produto atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    stock: { type: 'number' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Produto não encontrado',
          },
          '400': {
            description: 'Dados inválidos',
          },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Deletar Produto',
        description: 'Remove um produto do sistema',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do produto',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Produto deletado com sucesso',
          },
          '404': {
            description: 'Produto não encontrado',
          },
        },
      },
    },
    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Listar Pedidos',
        description: 'Retorna todos os pedidos cadastrados',
        responses: {
          '200': {
            description: 'Lista de pedidos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      userId: { type: 'string' },
                      status: { type: 'string' },
                      totalAmount: { type: 'number' },
                      createdAt: { type: 'string' },
                      updatedAt: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Criar Pedido',
        description: 'Cria um novo pedido',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'products'],
                properties: {
                  userId: { type: 'string', example: 'user-uuid-here' },
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['productId', 'quantity'],
                      properties: {
                        productId: { type: 'string', example: 'product-uuid-here' },
                        quantity: { type: 'number', example: 2 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Pedido criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    status: { type: 'string' },
                    totalAmount: { type: 'number' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos',
          },
          '404': {
            description: 'Usuário ou produto não encontrado',
          },
        },
      },
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Buscar Pedido por ID',
        description: 'Retorna um pedido específico pelo ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do pedido',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Pedido encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    status: { type: 'string' },
                    totalAmount: { type: 'number' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Pedido não encontrado',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
}; 