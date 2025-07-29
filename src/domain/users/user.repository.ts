import { User, CreateUserData, UpdateUserData } from './user.entity';
import { PaginationOptions, PaginationResult } from '../../shared/types/pagination.types';

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findAllWithPagination(options: PaginationOptions): Promise<PaginationResult<User>>;
  update(id: string, data: UpdateUserData): Promise<User | null>;
  delete(id: string): Promise<boolean>;
} 