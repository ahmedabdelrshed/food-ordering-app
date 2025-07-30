// app/api/socket/route.ts
import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'
import { Server as IOServer, Socket } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import { db } from '@/lib/prisma'
import { MessageData } from '@/types/chat'

export const config = { api: { bodyParser: false } }

export default function handler(req: NextApiRequest, res: NextResponse) {
    
    if (!global.io) {
      
        global.io = new IOServer(res.socket.server, {
            path: '/api/socket',
            cors: { origin: '*', methods: ['GET', 'POST'] }
        })

        const io = global.io
        io.on('connection', (socket:Socket) => {
            socket.on('join-chat', (chatId: string) => socket.join(chatId))
            socket.on('join-admin', () => socket.join('admin-room'))

            socket.on('send-message', async (data: MessageData) => {
                const { chatId, message, senderId, senderType } = data
                const newMessage = await db.message.create({
                    data: { chatId, content: message, senderId, senderType }
                })
                io.to(chatId).emit('new-message', newMessage)
                if (senderType === 'CUSTOMER') {
                    io.to('admin-room').emit('new-chat-notification', {
                        chatId,
                        message: newMessage,
                        customerName: 'Customer' // Replace/fetch actual name
                    })
                }
            })
        })
    }
    res.end()
}
