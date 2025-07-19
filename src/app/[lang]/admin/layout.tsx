import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import AdminTabs from "./_components/AdminTabs";

async function AdminLayout({
  params,
  children,
}: {
  params: Promise<{ lang: Locale }>;
  children: React.ReactNode;
}) {
  const locale = (await params).lang;
  const translations = await getTrans(locale);
  return (
    <>
      <AdminTabs translations={translations} />
      {children}
    </>
  );
}

export default AdminLayout;
