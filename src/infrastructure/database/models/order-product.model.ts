import { pgTable, uuid, integer, decimal, timestamp } from 'drizzle-orm/pg-core';
import { orders } from './order.model';
import { products } from './product.model';

export const orderProducts = pgTable('order_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  productId: uuid('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type OrderProductModel = typeof orderProducts.$inferSelect;
export type CreateOrderProductModel = typeof orderProducts.$inferInsert; 