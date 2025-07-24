import { cache } from "@/lib/cashe"
import { db } from "@/lib/prisma"
export const getProductsBestSellers = cache(() => {
    const products = db.product.findMany({ include: { sizes: true, extras: true } })
    return products
}, ['best-sellers'], {
    revalidate: 3600
})

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

export const getProductWithSearch = async (categoryName: string, query: string) => {
    let products
    if (categoryName && query) {
        products = await db.product.findMany({
            where: {
                category: {
                    name: {
                        contains: categoryName,
                        mode: 'insensitive'
                    }
                },
                AND: [
                    {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { description: { contains: query, mode: 'insensitive' } }
                        ]
                    }
                ]
            },
            include: {
                sizes: true,
                extras: true
            }
        })
    }
    else if (categoryName) {
        products = await db.product.findMany({
            where: {
                category: {
                    name: {
                        contains: categoryName,
                        mode: 'insensitive'
                    }
               }
            }, include: {
                sizes: true,
                extras: true
            }
        })
    } else if (query) {
        products = await db.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ]
            },
            include: {
                sizes: true,
                extras: true
            }
        })
    } else {
        products = await db.product.findMany({
            include: {
                sizes: true,
                extras: true
        }})
    }
    return products;
}