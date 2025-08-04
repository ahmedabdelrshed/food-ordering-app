"use client";
import { UserRole } from "@prisma/client";
import CustomerServiceChat from "./CustomerChat/CustomerServiceChat";
import AdminChatPanel from "./AdminChat/AdminChatPanel";
import { useSession } from "next-auth/react";

const RenderChat = () => {
  const session = useSession().data;
  const userRole = session?.user.role as UserRole;
  return (
    <div>
      {session &&
        (userRole === UserRole.ADMIN ? (
          <AdminChatPanel />
        ) : (
          <CustomerServiceChat />
        ))}
    </div>
  );
};

export default RenderChat;
