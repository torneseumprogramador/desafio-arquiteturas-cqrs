import { Order, CreateOrderData, UpdateOrderData, OrderStatus } from './order.entity';
import { OrderProduct, CreateOrderProductData } from './order-product.entity';

export interface OrderRepository {
  create(data: CreateOrderData): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  update(id: string, data: UpdateOrderData): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
}

export interface OrderProductRepository {
  create(data: CreateOrderProductData): Promise<OrderProduct>;
  findByOrderId(orderId: string): Promise<OrderProduct[]>;
  findByProductId(productId: string): Promise<OrderProduct[]>;
  deleteByOrderId(orderId: string): Promise<boolean>;
} 