export interface UpdateProductCommand {
  id: string;
  name?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
  stock?: number | undefined;
} 