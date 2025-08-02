"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import { Message } from "@prisma/client";
import { useCustomerChat } from "@/hooks/useCustomerChat";

export default function CustomerServiceChat() {
  const session = useSession();
  const customerId = session.data?.user?.id;
  const {
    isOpen,
    setIsOpen,
    chatId,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    isLoading,
    messagesEndRef,
  } = useCustomerChat(customerId);

  async function handleSendMessage() {
    try {
      await sendMessage();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 cursor-pointer right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Customer Service</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-96 overflow-hidden">
          <ScrollArea className="h-full w-full px-6">
            {messages.map((message:Message) => (
              <div
                key={message.id}
                className={
                  message.senderType === "USER"
                    ? "text-right mb-4"
                    : "text-left mb-4"
                }
              >
                <div
                  className={`inline-block p-3 break-all rounded-lg max-w-xs ${
                    message.senderType === "USER"
                      ? "bg-primary text-white"
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
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Type your message..."
              className="flex-1"
              disabled={!chatId}
              autoFocus
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              disabled={!newMessage.trim() || isLoading}
            >
              {isLoading ? <Loader /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
