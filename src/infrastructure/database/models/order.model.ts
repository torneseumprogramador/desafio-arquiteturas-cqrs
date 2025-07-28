import { pgTable, uuid, varchar, decimal, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './user.model';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed', 
  'shipped',
  'delivered',
  'cancelled'
]);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type OrderModel = typeof orders.$inferSelect;
export type CreateOrderModel = typeof orders.$inferInsert; 