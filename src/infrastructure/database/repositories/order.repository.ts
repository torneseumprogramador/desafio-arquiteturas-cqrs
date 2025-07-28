import { eq } from 'drizzle-orm';
import { db } from '../connection';
import { orders } from '../models/order.model';
import { orderProducts } from '../models/order-product.model';
import { products } from '../models/product.model';
import { OrderRepository } from '../../../domain/orders/order.repository';
import { Order, CreateOrderData, UpdateOrderData } from '../../../domain/orders/order.entity';
import { OrderProduct, CreateOrderProductData } from '../../../domain/orders/order-product.entity';

export class DrizzleOrderRepository implements OrderRepository {
  async create(data: CreateOrderData): Promise<Order> {
    // Calcular total do pedido
    let totalAmount = 0;
    
    // Criar o pedido
    const [order] = await db.insert(orders).values({
      userId: data.userId,
      status: 'pending',
      totalAmount: '0', // Será atualizado abaixo
    }).returning();

    if (!order) {
      throw new Error('Falha ao criar pedido');
    }

    // Criar os itens do pedido e calcular total
    for (const product of data.products) {
      // Buscar produto para obter preço
      const productData = await db.select().from(products).where(eq(products.id, product.productId)).limit(1);
      if (productData.length === 0) {
        throw new Error(`Produto com ID ${product.productId} não encontrado`);
      }

      const productInfo = productData[0];
      if (!productInfo) {
        throw new Error(`Produto com ID ${product.productId} não encontrado`);
      }

      const unitPrice = Number(productInfo.price);
      const totalPrice = unitPrice * product.quantity;
      totalAmount += totalPrice;

      // Criar item do pedido
      await db.insert(orderProducts).values({
        orderId: order.id,
        productId: product.productId,
        quantity: product.quantity,
        unitPrice: unitPrice.toString(),
        totalPrice: totalPrice.toString(),
      });
    }

    // Atualizar total do pedido
    const [updatedOrder] = await db.update(orders)
      .set({ totalAmount: totalAmount.toString() })
      .where(eq(orders.id, order.id))
      .returning();

    if (!updatedOrder) {
      throw new Error('Falha ao atualizar total do pedido');
    }

    return {
      id: updatedOrder.id,
      userId: updatedOrder.userId,
      status: updatedOrder.status as any,
      totalAmount: Number(updatedOrder.totalAmount),
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
    };
  }

  async findById(id: string): Promise<Order | null> {
    const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    
    if (order.length === 0) return null;

    const orderData = order[0];
    if (!orderData) return null;

    return {
      id: orderData.id,
      userId: orderData.userId,
      status: orderData.status as any,
      totalAmount: Number(orderData.totalAmount),
      createdAt: orderData.createdAt,
      updatedAt: orderData.updatedAt,
    };
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
    
    return userOrders.map(order => ({
      id: order.id,
      userId: order.userId,
      status: order.status as any,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }

  async findByStatus(status: any): Promise<Order[]> {
    const statusOrders = await db.select().from(orders).where(eq(orders.status, status));
    
    return statusOrders.map(order => ({
      id: order.id,
      userId: order.userId,
      status: order.status as any,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }

  async findAll(): Promise<Order[]> {
    const allOrders = await db.select().from(orders);
    
    return allOrders.map(order => ({
      id: order.id,
      userId: order.userId,
      status: order.status as any,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  }

  async update(id: string, data: UpdateOrderData): Promise<Order | null> {
    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.totalAmount !== undefined) updateData.totalAmount = data.totalAmount.toString();
    updateData.updatedAt = new Date();

    const [order] = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    if (!order) return null;

    return {
      id: order.id,
      userId: order.userId,
      status: order.status as any,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async delete(id: string): Promise<boolean> {
    // Primeiro deletar os itens do pedido
    await db.delete(orderProducts).where(eq(orderProducts.orderId, id));
    
    // Depois deletar o pedido
    const result = await db.delete(orders).where(eq(orders.id, id));
    return result.length > 0;
  }
} 