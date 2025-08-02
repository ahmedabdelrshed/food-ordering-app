import { db } from "@/lib/prisma";
import { TChatWithRelations } from "@/types/chat";
import { NextResponse } from "next/server";

// Utility: Find the date of the latest message in each chat
const getLastMessageDate = (chat: TChatWithRelations) =>
    chat.messages.length > 0
        ? new Date(chat.messages[chat.messages.length - 1].createdAt)
        : new Date(chat.updatedAt); // fallback if no message

export async function GET() {
    const chats = await db.chat.findMany({
        include: {
            user: true,
            messages: {
                orderBy: { createdAt: "asc" },
            },
        },
    });

    chats.sort((a, b) => {
        const aDate = getLastMessageDate(a);
        const bDate = getLastMessageDate(b);
        return bDate.getTime() - aDate.getTime(); // latest first
    });

    return NextResponse.json({ chats });
}
