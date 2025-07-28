import { QueryHandler } from '../../interfaces/query-handler.interface';
import { GetUserQuery } from './get-user.query';
import { UserRepository } from '../../../domain/users/user.repository';
import { User } from '../../../domain/users/user.entity';

export class GetUserHandler implements QueryHandler<GetUserQuery, User | null> {
  constructor(private userRepository: UserRepository) {}

  async execute(query: GetUserQuery): Promise<User | null> {
    return await this.userRepository.findById(query.id);
  }
} 