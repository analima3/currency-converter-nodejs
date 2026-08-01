export interface PaginationOptions {
  limit: number
  page: number
}

export interface PaginationMetadata extends PaginationOptions {
  totalElements: number
  totalPages: number
}

export interface PaginationResponse<T> {
  data: T[]
  pagination: PaginationMetadata
}
