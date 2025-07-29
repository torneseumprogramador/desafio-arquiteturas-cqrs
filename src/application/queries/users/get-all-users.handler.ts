import { QueryHandler } from '../../interfaces/query-handler.interface';
import { GetAllUsersQuery } from './get-all-users.query';
import { UserRepository } from '../../../domain/users/user.repository';
import { User } from '../../../domain/users/user.entity';
import { PaginatedResult } from '../../../shared/types/pagination.types';
import { createPaginatedResult } from '../../../shared/utils/pagination.util';

export class GetAllUsersHandler implements QueryHandler<GetAllUsersQuery, PaginatedResult<User>> {
  constructor(private userRepository: UserRepository) {}

  async execute(query: GetAllUsersQuery): Promise<PaginatedResult<User>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const { data, total } = await this.userRepository.findAllWithPagination({
      name: query.name,
      limit,
      offset,
    });

    return createPaginatedResult(data, total, page, limit);
  }
} 