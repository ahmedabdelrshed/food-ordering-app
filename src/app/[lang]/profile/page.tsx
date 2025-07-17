import { Pages, Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ProfilePage =async () => {
  const session = await getServerSession(authOptions);
  const lang = await getCurrentLang();
  // const translations = await getTrans(locale);

  if (!session) {
    redirect(`/${lang}/${Routes.AUTH}/${Pages.LOGIN}`);
  }
  if (session && session.user.role === UserRole.ADMIN) {
    redirect(`/${lang}/${Routes.ADMIN}`);
  }
  return (
    <div>ProfilePage</div>
  )
}

export default ProfilePage