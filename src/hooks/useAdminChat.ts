"use client";
import { useCallback, useEffect, useState } from "react";
import PusherClient from "pusher-js";
import { TChatWithRelations } from "@/types/chat";
import { Message } from "@prisma/client";

export function useAdminChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chats, setChats] = useState<TChatWithRelations[]>([]);
    const [selectedChat, setSelectedChat] = useState<TChatWithRelations | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function fetchChats() {
        const res = await fetch("/api/chats");
        const data = await res.json();
        setChats(data.chats);
    }

    // Master reset when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedChat(null);
            setChats([]);
            setSidebarOpen(true);
            setMessages([]);
            setNotificationCount(0);
            setNewMessage("");
        }
    }, [isOpen]);

    // Pusher for admin-chats broadcast
    useEffect(() => {
        if (!isOpen) return;
        fetchChats();
        const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });
        const channel = pusher.subscribe("admin-chats");
        channel.bind("new-message", ({ chatId, message }: { chatId: string; message: Message }) => {
            fetchChats();
            setNotificationCount((c) => c + 1);
            if (selectedChat && chatId === selectedChat.id)
                setMessages((prev) => [...prev, message]);
        });
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
        // eslint-disable-next-line
    }, [isOpen, selectedChat]);

    // Pusher for selected chat
    useEffect(() => {
        if (!selectedChat || !isOpen) return;
        setMessages(selectedChat.messages || []);
        const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });
        const channel = pusher.subscribe(`chat-${selectedChat.id}`);
        channel.bind("new-message", (payload: { message: Message }) => {
            setMessages((prev) => [...prev, payload.message]);
            fetchChats();
        });
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [selectedChat, isOpen]);

    // Input/send handler
    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() || !selectedChat) return;
        setIsLoading(true);
        try {
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatId: selectedChat.id,
                    content: newMessage,
                    senderType: "ADMIN",
                }),
            });
            setNewMessage("");
        } catch {
            // Optionally handle UI error
        } finally {
            setIsLoading(false);
        }
    }, [newMessage, selectedChat]);

    const handleSidebarToggle = useCallback(() => setSidebarOpen((s) => !s), []);
    const handleSelectChat = useCallback((chat: TChatWithRelations) => {
        setSelectedChat(chat);
        setMessages(chat.messages);
        setNotificationCount(0);
    }, []);

    return {
        isOpen,
        setIsOpen,
        sidebarOpen,
        handleSidebarToggle,
        chats,
        selectedChat,
        handleSelectChat,
        messages,
        newMessage,
        setNewMessage,
        isLoading,
        handleSendMessage,
        notificationCount,
    };
}
