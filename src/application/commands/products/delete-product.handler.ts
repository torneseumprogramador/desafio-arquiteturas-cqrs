import { CommandHandler } from '../../interfaces/command-handler.interface';
import { DeleteProductCommand } from './delete-product.command';
import { ProductRepository } from '../../../domain/products/product.repository';

export class DeleteProductHandler implements CommandHandler<DeleteProductCommand, boolean> {
  constructor(private productRepository: ProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<boolean> {
    // Verificar se o produto existe
    const existingProduct = await this.productRepository.findById(command.id);
    if (!existingProduct) {
      throw new Error('Produto não encontrado');
    }

    // Deletar o produto
    const success = await this.productRepository.delete(command.id);
    return success;
  }
} 