import { cache } from "@/lib/cashe"
import { db } from "@/lib/prisma"
import { TProductWithRelations } from "@/types/product"


export const getProductsBestSellers = cache(async () => {
    const bestSellerProductIdsAndCounts = await db.orderItem.groupBy({
        by: ['productId'],
        _count: { productId: true },
        orderBy: { _count: { productId: 'desc' } },
        take: 3,
    });

    const bestSellerIds = bestSellerProductIdsAndCounts.map(x => x.productId);

    if (bestSellerIds.length === 0) return [];
    const productsRaw = await db.product.findMany({
        where: { id: { in: bestSellerIds } },
        include: {
            sizes: true,
            extras: true
        }
    });

    // 3. Sort result by order count (same as in bestSellerIds)
    const idToCount = Object.fromEntries(
        bestSellerProductIdsAndCounts.map(p => [p.productId, p._count.productId])
    );
    const products = productsRaw.sort(
        (a, b) => idToCount[b.id] - idToCount[a.id]
    );

    return products;
}, ['best-sellers'], { revalidate: 3600 });


export const getProductsByCategory = cache(
    () => {
        const products = db.category.findMany({
            include: {
                products: {
                    include: {
                        sizes: true,
                        extras: true,
                    },
                },
            },
        });
        return products;
    },
    ["products-by-category"],
    { revalidate: 3600 }
);

export const getProducts = cache(
    () => {
        const products = db.product.findMany({
            orderBy: {
                order: "asc",
            },
        });
        return products;
    },
    ["products"],
    { revalidate: 3600 }
)

export const getProductById = cache(
    (id: string) => {
        const product = db.product.findUnique({
            where: { id },
            include: {
                sizes: true,
                extras: true,
            },
        });
        return product;
    },
    ["productById"],
    { revalidate: 3600 }
);

export const getProductWithSearchPaginated = async ({
    categoryName = "",
    query = "",
    cursor,          // string | undefined: the last product id of previous page
    limit = 4,      // default page size
}: {
    categoryName?: string;
    query?: string;
    cursor?: string;
    limit?: number;
}) => {
    // Build the where clause as before
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: any = {};
    if (categoryName && query) {
        where = {
            category: { name: { contains: categoryName, mode: 'insensitive' } },
            AND: [
                {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ],
                },
            ],
        };
    } else if (categoryName) {
        where = {
            category: { name: { contains: categoryName, mode: 'insensitive' } },
        };
    } else if (query) {
        where = {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
        };
    }

    // Prisma findMany options for pagination   
    // Fetch the products page
    const products: TProductWithRelations[] = await db.product.findMany({
        where,
        include: {
            sizes: true,
            extras: true,
        },
        orderBy: {
            createdAt: "desc", // or "id": "desc"
        },
        take: limit,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
    });

    // Figure out next cursor (if enough products, more remain)
    const nextCursor = products.length === limit ? products[products.length - 1].id : null;

    return {
        products,
        nextCursor,
    };
};
