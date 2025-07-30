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