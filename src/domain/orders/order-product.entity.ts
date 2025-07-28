export interface OrderProduct {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
}

export interface CreateOrderProductData {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
} 