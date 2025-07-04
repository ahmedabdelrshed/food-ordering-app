import { Prisma } from "@prisma/client";

export type TProductWithRelations = Prisma.ProductGetPayload<{
    include: {
        sizes: true;
        extras: true;
    }
}>
