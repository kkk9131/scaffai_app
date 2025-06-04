export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export interface PaginationParams {
    page: number;
    limit: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
//# sourceMappingURL=common.d.ts.map