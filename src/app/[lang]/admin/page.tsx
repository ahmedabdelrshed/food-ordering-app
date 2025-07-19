import UserForm from "@/components/UserForm/UserForm";
import { Pages, Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const AdminDashboard = async () => {
  const locale = await getCurrentLang();
  const translations = await getTrans(locale);
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session && session.user.role !== UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.PROFILE}`);
  }
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <UserForm user={session?.user} translations={translations} />
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard