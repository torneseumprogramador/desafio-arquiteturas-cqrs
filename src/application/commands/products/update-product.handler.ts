import { CommandHandler } from '../../interfaces/command-handler.interface';
import { UpdateProductCommand } from './update-product.command';
import { ProductRepository } from '../../../domain/products/product.repository';
import { Product } from '../../../domain/products/product.entity';

export class UpdateProductHandler implements CommandHandler<UpdateProductCommand, Product | null> {
  constructor(private productRepository: ProductRepository) {}

  async execute(command: UpdateProductCommand): Promise<Product | null> {
    // Verificar se o produto existe
    const existingProduct = await this.productRepository.findById(command.id);
    if (!existingProduct) {
      throw new Error('Produto não encontrado');
    }

    // Validar preço se fornecido
    if (command.price !== undefined && command.price < 0) {
      throw new Error('Preço não pode ser negativo');
    }

    // Validar estoque se fornecido
    if (command.stock !== undefined && command.stock < 0) {
      throw new Error('Estoque não pode ser negativo');
    }

    // Atualizar o produto
    const updatedProduct = await this.productRepository.update(command.id, {
      name: command.name,
      description: command.description,
      price: command.price,
      stock: command.stock,
    });

    return updatedProduct;
  }
} 