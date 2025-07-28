import { DomainException } from './domain.exception';

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super(`Usuário com ID ${userId} não encontrado`);
  }
} 