import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const chats = await db.chat.findMany({
        include: {
            user: true,
            messages: { orderBy: { createdAt: "asc" } }
        },
        orderBy: { updatedAt: "desc" }
    });
    return NextResponse.json({ chats });
}
