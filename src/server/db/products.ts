import { cache } from "@/lib/cashe"
import { db } from "@/lib/prisma"
export const getProductsBestSellers = cache(() => {
    const products = db.product.findMany({ include: { sizes: true, extras: true } })
    return products
}, ['best-sellers'], {
    revalidate: 3600
})