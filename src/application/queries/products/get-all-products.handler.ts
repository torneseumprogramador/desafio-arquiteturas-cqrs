import { QueryHandler } from '../../interfaces/query-handler.interface';
import { GetAllProductsQuery } from './get-all-products.query';
import { ProductRepository } from '../../../domain/products/product.repository';
import { Product } from '../../../domain/products/product.entity';

export class GetAllProductsHandler implements QueryHandler<GetAllProductsQuery, Product[]> {
  constructor(private productRepository: ProductRepository) {}

  async execute(query: GetAllProductsQuery): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
} 