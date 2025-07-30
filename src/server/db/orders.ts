// server/db/orders.ts
import { db } from "@/lib/prisma";
import { TOrderWithRelations } from "@/types/order";

export interface OrdersQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedOrdersResponse {
    orders: TOrderWithRelations[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export async function getOrders(params: OrdersQueryParams = {}): Promise<PaginatedOrdersResponse> {
    const {
        page = 1,
        limit = 5,
        search = ""
    } = params;

    const offset = (page - 1) * limit;

    // Build search conditions
    const searchConditions = search.trim() ? {
        OR: [
            {
                id: {
                    contains: search,
                    mode: "insensitive" as const
                }
            },
            {
                user: {
                    name: {
                        contains: search,
                        mode: "insensitive" as const
                    }
                }
            },
            {
                user: {
                    email: {
                        contains: search,
                        mode: "insensitive" as const
                    }
                }
            },
            {
                phone: {
                    contains: search,
                    mode: "insensitive" as const
                }
            },
            {
                city: {
                    contains: search,
                    mode: "insensitive" as const
                }
            },
            {
                streetAddress: {
                    contains: search,
                    mode: "insensitive" as const
                }
            }
        ]
    } : {};

    // Get total count for pagination
    const totalCount = await db.order.count({
        where: searchConditions
    });

    // Get paginated orders
    const orders = await db.order.findMany({
        where: searchConditions,
        include: {
            items: {
                include: {
                    product: true,
                    extras: true,
                    size: true
                }
            },
            user: true,
        },
        orderBy: {
            createdAt: 'desc'
        },
        skip: offset,
        take: limit
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
        orders,
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
    };
}
