"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatSidebar from "./ChatSidebar";
import ChatMainPanel from "./ChatMainPanel";
import { useAdminChat } from "@/hooks/useAdminChat";

export default function AdminChatPanel() {
  const {
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
  } = useAdminChat();

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
          <ChatSidebar
            sidebarOpen={sidebarOpen}
            chats={chats}
            selectedChat={selectedChat}
            onToggleSidebar={handleSidebarToggle}
            onSelectChat={handleSelectChat}
          />
          <ChatMainPanel
            sidebarOpen={sidebarOpen}
            onSidebarToggle={handleSidebarToggle}
            selectedChat={selectedChat}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            isLoading={isLoading}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
