import { CommandHandler } from '../../interfaces/command-handler.interface';
import { DeleteUserCommand } from './delete-user.command';
import { UserRepository } from '../../../domain/users/user.repository';

export class DeleteUserHandler implements CommandHandler<DeleteUserCommand, boolean> {
  constructor(private userRepository: UserRepository) {}

  async execute(command: DeleteUserCommand): Promise<boolean> {
    // Verificar se o usuário existe
    const existingUser = await this.userRepository.findById(command.id);
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    // Deletar o usuário
    const success = await this.userRepository.delete(command.id);
    return success;
  }
} 