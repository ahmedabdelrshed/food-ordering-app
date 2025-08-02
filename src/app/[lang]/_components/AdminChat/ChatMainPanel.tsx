import { ChevronLeft, UserRound, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TChatWithRelations } from "@/types/chat";
import { Message } from "@prisma/client";
import React, { useRef, useEffect } from "react";

interface Props {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  selectedChat: TChatWithRelations | null;
  messages: Message[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  isLoading: boolean;
  handleSendMessage: () => void;
}

export default function ChatMainPanel({
  sidebarOpen,
  onSidebarToggle,
  selectedChat,
  messages,
  newMessage,
  setNewMessage,
  isLoading,
  handleSendMessage,
}: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <section className="relative flex flex-col flex-1 h-full bg-white transition-all duration-300 ease-in-out">
      {/* Sidebar open button */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="absolute left-2 top-4 z-10 bg-white shadow-sm border rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 rotate-180 text-gray-600" />
        </Button>
      )}
      {selectedChat ? (
        <>
          <div className="flex items-center border-b p-4 gap-3">
            {selectedChat.user?.image ? (
              <Image
                src={selectedChat.user.image}
                alt={selectedChat.user?.name || ""}
                width={40}
                height={40}
                className="rounded-full object-cover border"
              />
            ) : (
              <UserRound className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-1" />
            )}
            <div className="flex-1 min-w-0">
              <span className="block font-semibold truncate">
                {selectedChat.user?.name || selectedChat.userId}
              </span>
              <span className="block text-xs text-gray-500 truncate">
                {selectedChat.user?.email}
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-1 h-96">
            <ScrollArea className="flex-1 h-96 overflow-y-auto px-4 bg-white">
              {messages.length === 0 ? (
                <div className="h-full flex text-sm items-center text-gray-400 justify-center">
                  No messages yet.
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.senderType === "ADMIN"
                        ? "text-right mb-4"
                        : "text-left mb-4"
                    }
                  >
                    <div
                      className={`inline-block p-3 break-all rounded-lg max-w-[65%] ${
                        message.senderType === "ADMIN"
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
                ))
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t flex gap-2 bg-white shrink-0">
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
                disabled={!newMessage.trim() || isLoading}
              >
                {isLoading ? <Loader /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center text-gray-500">
          Select a chat from the left to start viewing messages.
        </div>
      )}
    </section>
  );
}
