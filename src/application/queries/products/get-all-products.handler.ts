import { QueryHandler } from '../../interfaces/query-handler.interface';
import { GetAllProductsQuery } from './get-all-products.query';
import { ProductRepository } from '../../../domain/products/product.repository';
import { Product } from '../../../domain/products/product.entity';
import { PaginatedResult } from '../../../shared/types/pagination.types';
import { createPaginatedResult } from '../../../shared/utils/pagination.util';

export class GetAllProductsHandler implements QueryHandler<GetAllProductsQuery, PaginatedResult<Product>> {
  constructor(private productRepository: ProductRepository) {}

  async execute(query: GetAllProductsQuery): Promise<PaginatedResult<Product>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const { data, total } = await this.productRepository.findAllWithPagination({
      name: query.name,
      limit,
      offset,
    });

    return createPaginatedResult(data, total, page, limit);
  }
} 