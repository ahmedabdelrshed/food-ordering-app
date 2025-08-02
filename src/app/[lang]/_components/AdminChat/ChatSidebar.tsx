import { ChevronLeft, UserRound } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TChatWithRelations } from "@/types/chat";

interface ChatSidebarProps {
  sidebarOpen: boolean;
  chats: TChatWithRelations[];
  selectedChat: TChatWithRelations | null;
  onToggleSidebar: () => void;
  onSelectChat: (chat: TChatWithRelations) => void;
}

export default function ChatSidebar({
  sidebarOpen,
  chats,
  selectedChat,
  onToggleSidebar,
  onSelectChat,
}: ChatSidebarProps) {
  return (
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
            onClick={onToggleSidebar}
          >
            <ChevronLeft className="w-4 h-4" />
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
                  selectedChat?.id === chat.id ? "bg-blue-100 font-bold" : ""
                }`}
                onClick={() => onSelectChat(chat)}
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
  );
}
