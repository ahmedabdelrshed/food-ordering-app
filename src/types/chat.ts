// types/chat.ts
export interface Chat {
    id: string
    customerId: string
    adminId?: string
    status: ChatStatus
    createdAt: Date
    updatedAt: Date
    messages: Message[]
}

export interface Message {
    id: string
    chatId: string
    senderId: string
    content: string
    senderType: SenderType
    createdAt: Date
    readAt?: Date
}

export enum ChatStatus {
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED',
    ARCHIVED = 'ARCHIVED'
}

export enum SenderType {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN'
}

export interface ChatNotification {
    chatId: string
    message: Message
    customerName: string
}

export interface SocketEvents {
    'join-chat': (chatId: string) => void
    'join-admin': (adminId: string) => void
    'send-message': (data: MessageData) => void
    'new-message': (message: Message) => void
    'new-chat-notification': (notification: ChatNotification) => void
}

export interface MessageData {
    chatId: string
    message: string
    senderId: string
    senderType: SenderType
}
