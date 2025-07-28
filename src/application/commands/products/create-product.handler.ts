import { CommandHandler } from '../../interfaces/command-handler.interface';
import { CreateProductCommand } from './create-product.command';
import { ProductRepository } from '../../../domain/products/product.repository';
import { Product } from '../../../domain/products/product.entity';

export class CreateProductHandler implements CommandHandler<CreateProductCommand, Product> {
  constructor(private productRepository: ProductRepository) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    if (command.price < 0) {
      throw new Error('Preço não pode ser negativo');
    }

    if (command.stock < 0) {
      throw new Error('Estoque não pode ser negativo');
    }

    const product = await this.productRepository.create({
      name: command.name,
      description: command.description,
      price: command.price,
      stock: command.stock,
    });

    return product;
  }
} 