import { QueryHandler } from '../../interfaces/query-handler.interface';
import { GetAllUsersQuery } from './get-all-users.query';
import { UserRepository } from '../../../domain/users/user.repository';
import { User } from '../../../domain/users/user.entity';

export class GetAllUsersHandler implements QueryHandler<GetAllUsersQuery, User[]> {
  constructor(private userRepository: UserRepository) {}

  async execute(query: GetAllUsersQuery): Promise<User[]> {
    return await this.userRepository.findAll();
  }
} 