"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send } from "lucide-react";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  senderType: "CUSTOMER" | "ADMIN";
  createdAt: string;
}

interface ChatResponse {
  chatId: string;
  messages: Message[];
}

export default function CustomerServiceChat({
  customerId,
}: {
  customerId: string;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() =>{
    if (!isOpen) return;
    const socketConnection = io("/", { path: "/api/socket" });
    setSocket(socketConnection);
    initializeChat();
    return () => socketConnection.disconnect();
    // eslint-disable-next-line
  }, [isOpen, customerId]);

  useEffect(() => {
    if (!socket || !chatId) return;
    socket.emit("join-chat", chatId);
    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off("new-message");
    };
  }, [socket, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function initializeChat() {
    setIsLoading(true);
    const res = await fetch("/api/chat/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    const data: ChatResponse = await res.json();
    setChatId(data.chatId);
    setMessages(data.messages || []);
    setIsLoading(false);
  }

  function sendMessage() {
    if (!newMessage.trim() || !socket || !chatId) return;
    socket.emit("send-message", {
      chatId,
      message: newMessage,
      senderId: customerId,
      senderType: "CUSTOMER",
    });
    setNewMessage("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customer Service</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-96">
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-sm text-gray-500">Loading chat...</div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.senderType === "CUSTOMER"
                        ? "text-right mb-4"
                        : "text-left mb-4"
                    }
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-xs ${
                        message.senderType === "CUSTOMER"
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
              </>
            )}
          </ScrollArea>
          <div className="flex gap-2 p-4 border-t">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type your message..."
              className="flex-1"
              disabled={!chatId}
            />
            <Button
              onClick={sendMessage}
              size="icon"
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
