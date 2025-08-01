import { Request, Response } from 'express';
import { CreateProductHandler } from '../../application/commands/products/create-product.handler';
import { UpdateProductHandler } from '../../application/commands/products/update-product.handler';
import { DeleteProductHandler } from '../../application/commands/products/delete-product.handler';
import { GetProductHandler } from '../../application/queries/products/get-product.handler';
import { GetAllProductsHandler } from '../../application/queries/products/get-all-products.handler';
import { CreateProductCommand } from '../../application/commands/products/create-product.command';
import { UpdateProductCommand } from '../../application/commands/products/update-product.command';
import { DeleteProductCommand } from '../../application/commands/products/delete-product.command';
import { GetProductQuery } from '../../application/queries/products/get-product.query';
import { GetAllProductsQuery } from '../../application/queries/products/get-all-products.query';

export class ProductController {
  constructor(
    private createProductHandler: CreateProductHandler,
    private updateProductHandler: UpdateProductHandler,
    private deleteProductHandler: DeleteProductHandler,
    private getProductHandler: GetProductHandler,
    private getAllProductsHandler: GetAllProductsHandler
  ) {}

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, price, stock } = req.body;
      
      console.log(`[CREATE_PRODUCT] Tentativa de criar produto: ${name}`);

      if (!name || !description || price === undefined || stock === undefined) {
        console.log(`[CREATE_PRODUCT] Campos obrigatórios faltando: name=${!!name}, description=${!!description}, price=${price}, stock=${stock}`);
        res.status(400).json({ error: 'Nome, descrição, preço e estoque são obrigatórios' });
        return;
      }

      if (price < 0) {
        console.log(`[CREATE_PRODUCT] Preço negativo: ${price}`);
        res.status(400).json({ error: 'Preço não pode ser negativo' });
        return;
      }

      if (stock < 0) {
        console.log(`[CREATE_PRODUCT] Estoque negativo: ${stock}`);
        res.status(400).json({ error: 'Estoque não pode ser negativo' });
        return;
      }

      const command: CreateProductCommand = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
      };

      console.log(`[CREATE_PRODUCT] Executando comando para produto: ${name}`);
      const product = await this.createProductHandler.execute(command);

      console.log(`[CREATE_PRODUCT] Produto criado com sucesso: ${product.id}`);
      res.status(201).json({
        message: 'Produto criado com sucesso',
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          createdAt: product.createdAt,
        },
      });
    } catch (error) {
      console.error(`[CREATE_PRODUCT] Erro ao criar produto:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, price, stock } = req.body;

      if (!id) {
        res.status(400).json({ error: 'ID do produto é obrigatório' });
        return;
      }

      if (!name && !description && price === undefined && stock === undefined) {
        res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização' });
        return;
      }

      const command: UpdateProductCommand = {
        id,
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
      };

      const product = await this.updateProductHandler.execute(command);

      if (!product) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }

      res.status(200).json({
        message: 'Produto atualizado com sucesso',
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          updatedAt: product.updatedAt,
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

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID do produto é obrigatório' });
        return;
      }

      const command: DeleteProductCommand = { id };
      const success = await this.deleteProductHandler.execute(command);

      if (!success) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }

      res.status(200).json({
        message: 'Produto deletado com sucesso',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID do produto é obrigatório' });
        return;
      }

      const query: GetProductQuery = { id };
      const product = await this.getProductHandler.execute(query);

      if (!product) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }

      res.status(200).json({
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { name, page, limit } = req.query;
      
      const query: GetAllProductsQuery = {
        ...(name && { name: name as string }),
        ...(page && { page: parseInt(page as string) }),
        ...(limit && { limit: parseInt(limit as string) }),
      };

      const result = await this.getAllProductsHandler.execute(query);

      res.status(200).json({
        data: result.data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })),
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 