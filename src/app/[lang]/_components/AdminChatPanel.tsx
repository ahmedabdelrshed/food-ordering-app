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
import { ChevronLeft, MessageCircle, Send, UserRound } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";

export default function AdminChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchChats() {
    const res = await fetch("/api/chats");
    const data = await res.json();
    setChats(data.chats);
  }

  // Pusher for new chat/messages
  useEffect(() => {
    if (!isOpen) return;
    fetchChats();
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe("admin-chats");
    channel.bind("new-message", ({ chatId, message }: any) => {
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
  }, [isOpen]);

  // Pusher for selected chat
  useEffect(() => {
    if (!selectedChat || !isOpen) return;
    setMessages(selectedChat.messages || []);
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusher.subscribe(`chat-${selectedChat.id}`);
    channel.bind("new-message", (payload: any) => {
      setMessages((prev) => [...prev, payload.message]);
      fetchChats();
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [selectedChat, isOpen]);

  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedChat) return;
      try {
        setIsLoading(true);
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
    
   } catch (error) {
          console.log(error);
          toast.error("Something went wrong. Please try again.");
   }finally {
        setIsLoading(false);
   }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSidebarToggle() {
    setSidebarOpen((s) => !s);
  }

  function handleSelectChat(chat: any) {
    setSelectedChat(chat);
    setMessages(chat.messages);
    setNotificationCount(0);
  }

  const dialogContentClasses =
    "max-w-[1100px] w-full p-0 max-h-[92vh] h-[82vh] bg-white shadow-lg rounded-xl overflow-hidden";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 cursor-pointer right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <MessageCircle className="h-6 w-6" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-2 py-0.5 font-bold">
              {notificationCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className={dialogContentClasses}>
        <DialogHeader>
          <DialogTitle className="px-4 pt-4 pb-2 text-xl text-primary">
            Customer Service Chats
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-full w-full overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              sidebarOpen ? "w-80 border-r bg-gray-50" : "w-0"
            }`}
          >
            <div className={`${sidebarOpen ? "block" : "hidden"}`}>
              <div className="flex items-center justify-between p-3 border-b bg-white">
                <span className="font-semibold text-gray-600">User Chats</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close sidebar"
                  onClick={handleSidebarToggle}
                >
                  <ChevronLeft
                    className={`w-4 h-4 transition-transform ${
                      !sidebarOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>
              <ScrollArea className="h-[calc(80vh-120px)]">
                {chats.length === 0 ? (
                  <div className="p-6 text-gray-500">No chats yet.</div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex items-center gap-3 p-4 hover:bg-blue-50 cursor-pointer border-b transition-colors ${
                        selectedChat?.id === chat.id
                          ? "bg-blue-100 font-bold"
                          : ""
                      }`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      {chat.user?.image ? (
                        <Image
                          src={chat.user.image}
                          alt={chat.user?.name || ""}
                          width={32}
                          height={32}
                          className="rounded-full object-cover border"
                        />
                      ) : (
                        <UserRound className="h-8 w-8 text-gray-400 bg-gray-200 rounded-full p-1" />
                      )}
                      <div className="flex flex-col truncate">
                        <span className="truncate">
                          {chat.user?.name || chat.userId}
                        </span>
                        <span className="text-xs text-gray-400 truncate max-w-[140px]">
                          {chat.messages.at(-1)?.content?.slice(0, 48)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          </aside>

          {/* Main Chat Area */}
          <section className="relative flex flex-col flex-1 h-full bg-white transition-all duration-300 ease-in-out">
            {/* Show reopen sidebar button if sidebar is closed */}
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSidebarToggle}
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
                      messages.map((message: any) => (
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
