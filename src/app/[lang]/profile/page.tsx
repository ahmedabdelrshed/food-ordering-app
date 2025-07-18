import UserForm from "@/components/UserForm/UserForm";
import { Pages, Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ProfilePage =async () => {
  const session = await getServerSession(authOptions);
  const lang = await getCurrentLang();
  const translations = await getTrans(lang);

  if (!session) {
    redirect(`/${lang}/${Routes.AUTH}/${Pages.LOGIN}`);
  }
  if (session && session.user.role === UserRole.ADMIN) {
    redirect(`/${lang}/${Routes.ADMIN}`);
  }
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <h1 className="text-primary text-center font-bold text-4xl italic mb-10">
            {translations.profile.title}
          </h1>
          <UserForm translations={translations} user={session.user}/> 
        </div>
      </section>
    </main>
  );
}

export default ProfilePage