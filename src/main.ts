import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

// Importações de domínio
import { UserRepository } from './domain/users/user.repository';
import { ProductRepository } from './domain/products/product.repository';

// Importações de infraestrutura
import { DrizzleUserRepository } from './infrastructure/database/repositories/user.repository';
import { DrizzleProductRepository } from './infrastructure/database/repositories/product.repository';

// Importações de aplicação
import { CreateUserHandler } from './application/commands/users/create-user.handler';
import { GetUserHandler } from './application/queries/users/get-user.handler';
import { GetAllUsersHandler } from './application/queries/users/get-all-users.handler';
import { CreateProductHandler } from './application/commands/products/create-product.handler';
import { GetProductHandler } from './application/queries/products/get-product.handler';
import { GetAllProductsHandler } from './application/queries/products/get-all-products.handler';

// Importações de apresentação
import { UserController } from './presentation/controllers/user.controller';
import { ProductController } from './presentation/controllers/product.controller';
import { createUserRoutes } from './presentation/routes/user.routes';
import { createProductRoutes } from './presentation/routes/product.routes';

// Configuração de variáveis de ambiente
dotenv.config();

// Configuração do Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Injeção de dependências
const userRepository: UserRepository = new DrizzleUserRepository();
const productRepository: ProductRepository = new DrizzleProductRepository();

// Handlers
const createUserHandler = new CreateUserHandler(userRepository);
const getUserHandler = new GetUserHandler(userRepository);
const getAllUsersHandler = new GetAllUsersHandler(userRepository);

const createProductHandler = new CreateProductHandler(productRepository);
const getProductHandler = new GetProductHandler(productRepository);
const getAllProductsHandler = new GetAllProductsHandler(productRepository);

// Controllers
const userController = new UserController(
  createUserHandler,
  getUserHandler,
  getAllUsersHandler
);

const productController = new ProductController(
  createProductHandler,
  getProductHandler,
  getAllProductsHandler
);

// Rotas
app.use('/api/users', createUserRoutes(userController));
app.use('/api/products', createProductRoutes(productController));

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Aplicação CQRS funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Usuários: http://localhost:${PORT}/api/users`);
  console.log(`📦 Produtos: http://localhost:${PORT}/api/products`);
}); 