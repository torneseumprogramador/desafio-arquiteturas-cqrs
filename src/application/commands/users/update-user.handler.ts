import { CommandHandler } from '../../interfaces/command-handler.interface';
import { UpdateUserCommand } from './update-user.command';
import { UserRepository } from '../../../domain/users/user.repository';
import { User } from '../../../domain/users/user.entity';

export class UpdateUserHandler implements CommandHandler<UpdateUserCommand, User | null> {
  constructor(private userRepository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<User | null> {
    // Verificar se o usuário existe
    const existingUser = await this.userRepository.findById(command.id);
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    // Se o email está sendo atualizado, verificar se já existe
    if (command.email && command.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(command.email);
      if (userWithEmail) {
        throw new Error('Email já está em uso');
      }
    }

    // Atualizar o usuário
    const updateData: any = {};
    if (command.name !== undefined) updateData.name = command.name;
    if (command.email !== undefined) updateData.email = command.email;
    if (command.password !== undefined) updateData.password = command.password;

    const updatedUser = await this.userRepository.update(command.id, updateData);

    return updatedUser;
  }
} 