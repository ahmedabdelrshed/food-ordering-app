"use client";

import { Button, buttonVariants } from "../ui/button";
import { useState } from "react";
import { Menu, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Routes } from "@/lib/constants";
import Link from "../Link/Link";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();

  const links = [
    {
      id: crypto.randomUUID(),
      title: "Menu",
      href: Routes.MENU,
    },
    {
      id: crypto.randomUUID(),
      title: "About",
      href: Routes.ABOUT,
    },
    {
      id: crypto.randomUUID(),
      title: "Contact",
      href: Routes.CONTACT,
    },
  ];
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
              href={`/${link.href}`}
              className={`hover:text-primary duration-200 transition-colors font-semibold ${
                pathname.startsWith(`/${link.href}`)
                  ? "text-primary"
                  : "text-accent"
              }`}
            >
              {link.title}
            </Link>
          </li>
        ))}
        <Link
          href={`/${Routes.AUTH}`}
          className={`${buttonVariants({
            size: "lg",
          })} !px-8 !rounded-full !font-bold `}
        >
          Login
        </Link>
      </ul>
    </nav>
  );
}

export default Navbar;
