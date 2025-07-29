// app/api/orders/[orderId]/route.ts
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;
        const orderId = pathname.split("/").pop(); // extract orderId from the URL

        if (!orderId) {
            return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
        }

        const { status } = await request.json();

        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: { status },
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { error: "Failed to update order status" },
            { status: 500 }
        );
    }
}
