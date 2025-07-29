export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationOptions {
  name?: string;
  limit: number;
  offset: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
} 