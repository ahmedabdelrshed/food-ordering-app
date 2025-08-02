import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import CustomerServiceChat from "./CustomerServiceChat";
import AdminChatPanel from "./AdminChat/AdminChatPanel";

const RenderChat = async () => {
  const session = await getServerSession(authOptions);
  const userRole = session?.user.role as UserRole;
  return (
    <div>
      {userRole === UserRole.ADMIN ? (
        <AdminChatPanel />
      ) : (
        <CustomerServiceChat />
      )}
    </div>
  );
};

export default RenderChat;
