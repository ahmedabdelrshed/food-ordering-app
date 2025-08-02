import { useCallback, useEffect, useRef, useState } from "react";
import PusherClient from "pusher-js";
import { Message } from "@prisma/client";

export function useCustomerChat(customerId?: string | null) {
    const [chatId, setChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch initial chat, Pusher subscription
    useEffect(() => {
        if (!isOpen || !customerId) return;
        let pusher: PusherClient | null = null;
        (async () => {
            const res = await fetch("/api/chat/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerId }),
            });
            const data = await res.json();
            setChatId(data.chatId);
            setMessages(data.messages || []);
            // Setup Pusher
            if (data.chatId) {
                pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
                    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
                });
               const channel = pusher.subscribe(`chat-${data.chatId}`);
                channel.bind("new-message", (payload: { message: Message }) => {
                    setMessages((m) => [...m, payload.message]);
                });
            }
        })();
        return () => {
            
        };
    }, [isOpen, customerId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = useCallback(async () => {
        if (!newMessage.trim() || !chatId) return;
        setIsLoading(true);
        try {
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatId,
                    content: newMessage,
                    senderType: "USER",
                }),
            });
            setNewMessage("");
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [chatId, newMessage]);

    return {
        isOpen,
        setIsOpen,
        chatId,
        messages,
        newMessage,
        setNewMessage,
        sendMessage,
        isLoading,
        messagesEndRef,
    };
}
