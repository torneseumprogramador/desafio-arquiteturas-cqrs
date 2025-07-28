import { CommandHandler } from '../../interfaces/command-handler.interface';
import { CreateOrderCommand } from './create-order.command';
import { OrderRepository } from '../../../domain/orders/order.repository';
import { UserRepository } from '../../../domain/users/user.repository';
import { ProductRepository } from '../../../domain/products/product.repository';
import { Order } from '../../../domain/orders/order.entity';

export class CreateOrderHandler implements CommandHandler<CreateOrderCommand, Order> {
  constructor(
    private orderRepository: OrderRepository,
    private userRepository: UserRepository,
    private productRepository: ProductRepository
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se há produtos no pedido
    if (!command.products || command.products.length === 0) {
      throw new Error('Pedido deve conter pelo menos um produto');
    }

    // Verificar se todos os produtos existem e têm estoque suficiente
    let totalAmount = 0;
    for (const item of command.products) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Produto com ID ${item.productId} não encontrado`);
      }
      
      if (item.quantity <= 0) {
        throw new Error(`Quantidade deve ser maior que zero para o produto ${product.name}`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para o produto ${product.name}. Disponível: ${product.stock}, Solicitado: ${item.quantity}`);
      }
      
      totalAmount += product.price * item.quantity;
    }

    // Criar o pedido
    const order = await this.orderRepository.create({
      userId: command.userId,
      products: command.products,
    });

    return order;
  }
} 