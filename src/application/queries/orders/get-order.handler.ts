import { QueryHandler } from '../../interfaces/query-handler.interface';
import { GetOrderQuery } from './get-order.query';
import { OrderRepository } from '../../../domain/orders/order.repository';
import { Order } from '../../../domain/orders/order.entity';

export class GetOrderHandler implements QueryHandler<GetOrderQuery, Order | null> {
  constructor(private orderRepository: OrderRepository) {}

  async execute(query: GetOrderQuery): Promise<Order | null> {
    return await this.orderRepository.findById(query.id);
  }
} 