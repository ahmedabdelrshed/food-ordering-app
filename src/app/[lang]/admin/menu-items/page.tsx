import Link from "@/components/Link/Link";
import { buttonVariants } from "@/components/ui/button";
import { Languages, Pages, Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { ArrowRightCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MenuItems from "./_components/MenuItems";
import { getProducts } from "@/server/db/products";

const MenuItemsPage = async () => {
  const locale = await getCurrentLang();
  const translations = await getTrans(locale);
  const session = await getServerSession(authOptions);
  const products = await getProducts();
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
          <Link
            href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${Pages.NEW}`}
            className={`${buttonVariants({
              variant: "outline",
            })} !mx-auto !flex !w-80 !h-10 mb-8 hover:!text-white`}
          >
            {translations.admin["menu-items"].createNewMenuItem}
            <ArrowRightCircle
              className={`!w-5 !h-5 ${
                locale === Languages.ARABIC ? "rotate-180 " : ""
              }`}
            />
          </Link>
          <MenuItems products={products} />
        </div>
      </section>
    </main>
  );
};

export default MenuItemsPage;
