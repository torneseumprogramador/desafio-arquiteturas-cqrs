import { Product, CreateProductData, UpdateProductData } from './product.entity';
import { PaginationOptions, PaginationResult } from '../../shared/types/pagination.types';

export interface ProductRepository {
  create(data: CreateProductData): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findAllWithPagination(options: PaginationOptions): Promise<PaginationResult<Product>>;
  update(id: string, data: UpdateProductData): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
} 