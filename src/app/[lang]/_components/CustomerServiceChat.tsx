"use client";
import { useEffect, useRef, useState } from "react";
import PusherClient from "pusher-js";
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
import { Message } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function CustomerServiceChat() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const customerId = session.data?.user?.id;

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const res = await fetch("/api/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });
      const data = await res.json();
      setChatId(data.chatId);
      setMessages(data.messages || []);
      // Pusher subscription
      if (data.chatId) {
        const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });
        const channel = pusher.subscribe(`chat-${data.chatId}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        channel.bind("new-message", (payload: any) => {
          console.log("new-message", payload);
          setMessages((m) => [...m, payload.message]);
        });
        return () => {
          channel.unbind_all();
          channel.unsubscribe();
          pusher.disconnect();
        };
      }
    })();
  }, [isOpen, customerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!newMessage.trim() || !chatId) return;
   
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, content: newMessage, senderType: "USER" }),
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
      <DialogContent className="sm:max-w-md max-h-[90vh] ">
        <DialogHeader>
          <DialogTitle>Customer Service</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-96 overflow-hidden">
          <ScrollArea className="h-full w-full px-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.senderType === "USER"
                    ? "text-right mb-4"
                    : "text-left mb-4"
                }
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-xs ${
                    message.senderType === "USER"
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
              autoFocus
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
