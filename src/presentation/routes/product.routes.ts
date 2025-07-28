import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

export function createProductRoutes(productController: ProductController): Router {
  const router = Router();

  // POST /products - Criar produto
  router.post('/', (req, res) => productController.createProduct(req, res));

  // GET /products/:id - Buscar produto por ID
  router.get('/:id', (req, res) => productController.getProduct(req, res));

  // GET /products - Buscar todos os produtos
  router.get('/', (req, res) => productController.getAllProducts(req, res));

  return router;
} 