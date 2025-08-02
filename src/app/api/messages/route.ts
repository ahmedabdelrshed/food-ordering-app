import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";

// Setup Pusher Server SDK
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

export async function POST(req: NextRequest) {
    const { chatId, content, senderType } = await req.json();
console.log(pusher)
    // Save message in DB
    const message = await db.message.create({
        data: { chatId, content, senderType }
    });

    // Send to user and admin via separate channels
    await pusher.trigger(
        `chat-${chatId}`,
        "new-message",
        { message }
    );
    console.log('Triggering pusher:', chatId, message, process.env.PUSHER_KEY);

    if (senderType === "USER") {
        await pusher.trigger(
            `admin-chats`,
            "new-message",
            { chatId, message }
        );
    }
    console.log('Triggering pusher:', chatId, message, process.env.PUSHER_KEY);

    return NextResponse.json({ message });
}
