import { eq, like, count } from 'drizzle-orm';
import { db } from '../connection';
import { products } from '../models/product.model';
import { ProductRepository } from '../../../domain/products/product.repository';
import { Product, CreateProductData, UpdateProductData } from '../../../domain/products/product.entity';
import { PaginationOptions, PaginationResult } from '../../../shared/types/pagination.types';
import { createPaginationResult } from '../../../shared/utils/pagination.util';

export class DrizzleProductRepository implements ProductRepository {
  async create(data: CreateProductData): Promise<Product> {
    const [product] = await db.insert(products).values({
      name: data.name,
      description: data.description,
      price: data.price.toString(),
      stock: data.stock,
    }).returning();

    if (!product) {
      throw new Error('Falha ao criar produto');
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async findById(id: string): Promise<Product | null> {
    const product = await db.select().from(products).where(eq(products.id, id)).limit(1);
    
    if (product.length === 0) return null;

    const productData = product[0];
    if (!productData) return null;

    return {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      stock: productData.stock,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    };
  }

  async findAll(): Promise<Product[]> {
    const allProducts = await db.select().from(products);
    
    return allProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }

  async update(id: string, data: UpdateProductData): Promise<Product | null> {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock !== undefined) updateData.stock = data.stock;
    updateData.updatedAt = new Date();

    const [product] = await db.update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.length > 0;
  }

  async findAllWithPagination(options: PaginationOptions): Promise<PaginationResult<Product>> {
    const { name, limit, offset } = options;

    // Query para contar total
    let totalResult;
    if (name) {
      totalResult = await db.select({ count: count() }).from(products).where(like(products.name, `%${name}%`));
    } else {
      totalResult = await db.select({ count: count() }).from(products);
    }
    const total = totalResult[0]?.count || 0;

    // Query para buscar dados com paginação
    let data;
    if (name) {
      data = await db.select().from(products).where(like(products.name, `%${name}%`)).limit(limit).offset(offset);
    } else {
      data = await db.select().from(products).limit(limit).offset(offset);
    }

    return createPaginationResult(
      data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
      total
    );
  }
} 