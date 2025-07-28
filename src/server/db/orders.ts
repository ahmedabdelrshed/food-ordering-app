import { db } from "@/lib/prisma";

export const getOrders = () => {
    const orders = db.order.findMany({
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
        }
    })
    return orders
}