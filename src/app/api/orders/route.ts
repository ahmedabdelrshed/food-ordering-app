// app/api/orders/route.ts
import { getOrders } from "@/server/db/orders";
import { NextResponse } from "next/server";
export async function GET() {
    const orders = await getOrders();
    return NextResponse.json(orders);
}

