import { DomainException } from './domain.exception';

export class ProductNotFoundException extends DomainException {
  constructor(productId: string) {
    super(`Produto com ID ${productId} não encontrado`);
  }
} 