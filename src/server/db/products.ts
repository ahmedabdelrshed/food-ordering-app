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