"use client";
import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, XIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { Routes } from "@/lib/constants";
import Link from "../Link/Link";
import { Translations } from "@/types/translations";
import { Session } from "next-auth";
import { useClientSession } from "@/hooks/useClientSession";
import { UserRole } from "@prisma/client";
import AuthButtons from "./AuthButtons";

function Navbar({
  translations,
  initialSession,
}: {
  translations: Translations;
  initialSession: Session | null;
}) {
  const session = useClientSession(initialSession);
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();
  const { lang } = useParams();
  const links = [
    {
      id: crypto.randomUUID(),
      title: translations.navbar.menu,
      href: Routes.MENU,
    },
    {
      id: crypto.randomUUID(),
      title: translations.navbar.about,
      href: Routes.ABOUT,
    },
    {
      id: crypto.randomUUID(),
      title: translations.navbar.contact,
      href: Routes.CONTACT,
    },
  ];
    const isAdmin = session.data?.user.role === UserRole.ADMIN;
  return (
    <nav className="order-last lg:order-none">
      <Button
        variant="secondary"
        size="sm"
        className="lg:hidden cursor-pointer "
        onClick={() => setOpenMenu(true)}
      >
        <Menu className="!w-6 !h-6" />
      </Button>
      <ul
        className={`fixed lg:static ${
          openMenu ? "left-0 z-50" : "-left-full"
        } top-0 px-10 py-20 lg:p-0 bg-background lg:bg-transparent transition-all duration-200 h-full lg:h-auto flex-col lg:flex-row w-full lg:w-auto flex items-start lg:items-center gap-10`}
      >
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-10 right-10 lg:hidden cursor-pointer"
          onClick={() => setOpenMenu(false)}
        >
          <XIcon className="!w-6 !h-6" />
        </Button>
        {links.map((link) => (
          <li key={link.id}>
            <Link
              onClick={() => setOpenMenu(false)}
              href={`/${lang}/${link.href}`}
              className={`hover:text-primary duration-200 transition-colors font-semibold ${
                pathname.startsWith(`/${lang}/${link.href}`)
                  ? "text-primary"
                  : "text-accent"
              }`}
            >
              {link.title}
            </Link>
          </li>
        ))}
        {session.data?.user && (
          <li>
            <Link
              href={
                isAdmin
                  ? `/${lang}/${Routes.ADMIN}`
                  : `/${lang}/${Routes.PROFILE}`
              }
              onClick={() => setOpenMenu(false)}
              className={`${
                pathname.startsWith(
                  isAdmin
                    ? `/${lang}/${Routes.ADMIN}`
                    : `/${lang}/${Routes.PROFILE}`
                )
                  ? "text-primary"
                  : "text-accent"
              } hover:text-primary duration-200 transition-colors font-semibold`}
            >
              {isAdmin
                ? translations.navbar.admin
                : translations.navbar.profile}
            </Link>
          </li>
        )}
        <div className="md:hidden">
          <AuthButtons
            translations={translations}
            initialSession={initialSession}
          />
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
