export interface CreateOrderCommand {
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
} 