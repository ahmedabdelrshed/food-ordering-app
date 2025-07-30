// app/api/chat/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ChatStatus } from '@prisma/client'
import { db } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const { customerId } = await req.json()
    if (!customerId) return NextResponse.json({ error: 'No customerId' }, { status: 400 })
    let chat = await db.chat.findFirst({
        where: { customerId, status: ChatStatus.ACTIVE },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
    })
    if (!chat) {
        chat = await db.chat.create({
            data: { customerId, status: ChatStatus.ACTIVE },
            include: { messages: true }
        })
    }
    return NextResponse.json({ chatId: chat.id, messages: chat.messages })
}
