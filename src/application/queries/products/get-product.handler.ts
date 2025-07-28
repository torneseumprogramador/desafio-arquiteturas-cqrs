import { QueryHandler } from '../../interfaces/query-handler.interface';
import { GetProductQuery } from './get-product.query';
import { ProductRepository } from '../../../domain/products/product.repository';
import { Product } from '../../../domain/products/product.entity';

export class GetProductHandler implements QueryHandler<GetProductQuery, Product | null> {
  constructor(private productRepository: ProductRepository) {}

  async execute(query: GetProductQuery): Promise<Product | null> {
    return await this.productRepository.findById(query.id);
  }
} 