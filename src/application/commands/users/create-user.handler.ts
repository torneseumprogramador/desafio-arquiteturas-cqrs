import { CommandHandler } from '../../interfaces/command-handler.interface';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../../domain/users/user.repository';
import { User } from '../../../domain/users/user.entity';

export class CreateUserHandler implements CommandHandler<CreateUserCommand, User> {
  constructor(private userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    // Verificar se o email já existe
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Criar o usuário
    const user = await this.userRepository.create({
      name: command.name,
      email: command.email,
      password: command.password, // Em produção, deve ser hash da senha
    });

    return user;
  }
} 