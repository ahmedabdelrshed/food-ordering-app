import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { customerId } = await req.json();
    let chat = await db.chat.findUnique({
        where: { userId: customerId },
        include: { messages: { orderBy: { createdAt: "asc" } } }
    });
    if (!chat) {
        chat = await db.chat.create({
            data: { userId: customerId },
            include: { messages: true }
        });
    }
    return NextResponse.json({ chatId: chat.id, messages: chat.messages });
}
