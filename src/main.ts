import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

// Importações de domínio
import { UserRepository } from './domain/users/user.repository';
import { ProductRepository } from './domain/products/product.repository';
import { OrderRepository } from './domain/orders/order.repository';

// Importações de infraestrutura
import { DrizzleUserRepository } from './infrastructure/database/repositories/user.repository';
import { DrizzleProductRepository } from './infrastructure/database/repositories/product.repository';
import { DrizzleOrderRepository } from './infrastructure/database/repositories/order.repository';

// Importações de aplicação
import { CreateUserHandler } from './application/commands/users/create-user.handler';
import { UpdateUserHandler } from './application/commands/users/update-user.handler';
import { DeleteUserHandler } from './application/commands/users/delete-user.handler';
import { GetUserHandler } from './application/queries/users/get-user.handler';
import { GetAllUsersHandler } from './application/queries/users/get-all-users.handler';
import { CreateProductHandler } from './application/commands/products/create-product.handler';
import { UpdateProductHandler } from './application/commands/products/update-product.handler';
import { DeleteProductHandler } from './application/commands/products/delete-product.handler';
import { GetProductHandler } from './application/queries/products/get-product.handler';
import { GetAllProductsHandler } from './application/queries/products/get-all-products.handler';
import { CreateOrderHandler } from './application/commands/orders/create-order.handler';
import { GetOrderHandler } from './application/queries/orders/get-order.handler';
import { GetAllOrdersHandler } from './application/queries/orders/get-all-orders.handler';

// Importações de apresentação
import { UserController } from './presentation/controllers/user.controller';
import { ProductController } from './presentation/controllers/product.controller';
import { OrderController } from './presentation/controllers/order.controller';
import { HomeController } from './presentation/controllers/home.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { createUserRoutes } from './presentation/routes/user.routes';
import { createProductRoutes } from './presentation/routes/product.routes';
import { createOrderRoutes } from './presentation/routes/order.routes';
import { createHealthRoutes } from './presentation/routes/health.routes';
import { setupSwagger } from './infrastructure/config/swagger.config';

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
const orderRepository: OrderRepository = new DrizzleOrderRepository();

// Handlers
const createUserHandler = new CreateUserHandler(userRepository);
const updateUserHandler = new UpdateUserHandler(userRepository);
const deleteUserHandler = new DeleteUserHandler(userRepository);
const getUserHandler = new GetUserHandler(userRepository);
const getAllUsersHandler = new GetAllUsersHandler(userRepository);

const createProductHandler = new CreateProductHandler(productRepository);
const updateProductHandler = new UpdateProductHandler(productRepository);
const deleteProductHandler = new DeleteProductHandler(productRepository);
const getProductHandler = new GetProductHandler(productRepository);
const getAllProductsHandler = new GetAllProductsHandler(productRepository);

const createOrderHandler = new CreateOrderHandler(orderRepository, userRepository, productRepository);
const getOrderHandler = new GetOrderHandler(orderRepository);
const getAllOrdersHandler = new GetAllOrdersHandler(orderRepository);

// Controllers
const userController = new UserController(
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getUserHandler,
  getAllUsersHandler
);

const productController = new ProductController(
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductHandler,
  getAllProductsHandler
);

const orderController = new OrderController(
  createOrderHandler,
  getOrderHandler,
  getAllOrdersHandler
);

const homeController = new HomeController();
const healthController = new HealthController();

// Configuração do Swagger
setupSwagger(app);

// Rotas
app.use('/api/users', createUserRoutes(userController));
app.use('/api/products', createProductRoutes(productController));
app.use('/api/orders', createOrderRoutes(orderController));
app.use('/health', createHealthRoutes(healthController));

// Rota home
app.get('/', (req, res) => homeController.getHome(req, res));

// Middleware de tratamento de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏥 Health ping: http://localhost:${PORT}/health/ping`);
  console.log(`🗄️ Health database: http://localhost:${PORT}/health/database`);
  console.log(`📋 Health detailed: http://localhost:${PORT}/health/detailed`);
  console.log(`🏠 Home: http://localhost:${PORT}/`);
  console.log(`👥 Usuários: http://localhost:${PORT}/api/users`);
  console.log(`📦 Produtos: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Pedidos: http://localhost:${PORT}/api/orders`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
}); 