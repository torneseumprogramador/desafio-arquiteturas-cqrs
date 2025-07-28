import { QueryHandler } from '../../interfaces/query-handler.interface';
import { GetAllOrdersQuery } from './get-all-orders.query';
import { OrderRepository } from '../../../domain/orders/order.repository';
import { Order } from '../../../domain/orders/order.entity';

export class GetAllOrdersHandler implements QueryHandler<GetAllOrdersQuery, Order[]> {
  constructor(private orderRepository: OrderRepository) {}

  async execute(query: GetAllOrdersQuery): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }
} 