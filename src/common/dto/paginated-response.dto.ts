export class PaginatedResponseDto<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  constructor(data: T[], totalItems: number, page: number, limit: number) {
    this.data = data;
    const totalPages = Math.ceil(totalItems / limit);
    this.meta = {
      totalItems,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
