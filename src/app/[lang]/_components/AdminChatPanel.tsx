/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import PusherClient from "pusher-js";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell,  ChartAreaIcon,  Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function fetchChats() {
    const res = await fetch("/api/chats");
    const data = await res.json();
      setChats(data.chats);
  }

  useEffect(() => {
    if (!isOpen) return;
    fetchChats();
    // Listen for all incoming customer messages
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
      const channel = pusher.subscribe("admin-chats");
      channel.bind("new-message", ({ chatId, message }: any) => {
        console.log("new-message", { chatId, message });
        fetchChats();
        setNotificationCount((c) => c + 1);
      // optionally: if currently viewing this chat, refetch its messages
      if (selectedChat && chatId === selectedChat.id)
        setMessages((prev) => [...prev, message]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
    // eslint-disable-next-line
  }, [isOpen]);

  function handleSelectChat(chat: any) {
    setSelectedChat(chat);
    setMessages(chat.messages);
    setNotificationCount(0);

    // Listen for new messages on this chat (admin replies and customer new)
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe(`chat-${chat.id}`);
      channel.bind("new-message", (payload: any) => {
        fetchChats();
        console.log("new-message", payload);
      setMessages((prev) => [...prev, payload.message]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedChat) return;
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
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-6 h-6" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-2 py-0.5 font-bold">
              {notificationCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 h-[70vh]">
        <DialogHeader>
          <DialogTitle>Customer Service Chats</DialogTitle>
          <div className="text-lg font-bold p-4 border-b">All User Chats</div>
        </DialogHeader>
        <div className="flex h-full w-full overflow-hidden">
          <aside className="w-64 border-r h-full overflow-y-auto bg-gray-50">
            <ScrollArea className="h-full">
              {chats.length === 0 ? (
                <div className="p-6 text-gray-500">No chats yet.</div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer border-b ${
                      selectedChat?.id === chat.id
                        ? "bg-blue-100 font-bold"
                        : ""
                    }`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    <ChartAreaIcon className="h-6 w-6 mr-2 text-blue-500" />
                    <div>
                      <div>{chat.user?.name || chat.userId}</div>
                      <div className="text-xs text-gray-400">
                        {chat.messages.at(-1)?.content?.slice(0, 32)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </aside>
          <section className="flex flex-col flex-1 h-full">
            {selectedChat ? (
              <>
                <div className="flex items-center border-b p-3 bg-white">
                  <span className="font-semibold">
                    {selectedChat.user?.name || selectedChat.userId}
                  </span>
                  <span className="text-xs ml-2 text-gray-500">
                    {selectedChat.user?.email}
                  </span>
                </div>
                <ScrollArea className="flex-1 p-4 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        message.senderType === "ADMIN"
                          ? "text-right mb-4"
                          : "text-left mb-4"
                      }
                    >
                      <div
                        className={`inline-block p-3 rounded-lg max-w-xs ${
                          message.senderType === "ADMIN"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>
                <div className="p-4 border-t flex gap-2 bg-white">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder="Type your message..."
                                      disabled={!selectedChat}
                                      autoFocus
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col flex-1 items-center justify-center text-gray-500">
                Select a user chat to start viewing messages.
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
