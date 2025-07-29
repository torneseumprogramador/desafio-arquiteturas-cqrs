import { PaginatedResult, PaginationResult } from '../types/pagination.types';

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export function createPaginationResult<T>(
  data: T[],
  total: number
): PaginationResult<T> {
  return {
    data,
    total,
  };
} 