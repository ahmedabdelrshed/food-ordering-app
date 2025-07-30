import { Prisma } from "@prisma/client";

export type TOrderWithRelations = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                product: true,
                extras: true,
                size: true
            }
        },
        user: true,
    }
}>


export interface PaginatedOrdersResponse {
    orders: TOrderWithRelations[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface OrdersTableProps {
    initialData: PaginatedOrdersResponse;
}

export interface SearchAndFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    itemsPerPage: number;
    setItemsPerPage: (count: number) => void;
    totalCount: number;
    loading: boolean;
    onClearSearch: () => void;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    loading: boolean;
    onPageChange: (page: number) => void;
    onNextPage: () => void;
    onPreviousPage: () => void;
}
