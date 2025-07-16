"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { Translations } from "@/types/translations";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Pages, Routes } from "@/lib/constants";
import { Session } from "next-auth";
import { useClientSession } from "@/hooks/useClientSession";

const AuthButtons = ({
  initialSession,
  translations,
}: {
  initialSession: Session | null;
  translations: Translations;
}) => {
  const session = useClientSession(initialSession);
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useParams();
  return (
    <div>
      {session.data?.user && (
        <div className="flex items-center  gap-10">
          <Button
            className="!px-8 !rounded-full cursor-pointer"
            size="lg"
            onClick={() => signOut()}
          >
            {translations.navbar.signOut}
          </Button>
        </div>
      )}
      {!session.data?.user && (
        <div className="flex items-center gap-6">
          <Button
            className={`${
              pathname.startsWith(`/${lang}/${Routes.AUTH}/${Pages.LOGIN}`)
                ? "text-primary"
                : "text-accent"
            } hover:text-primary cursor-pointer  duration-200 transition-colors font-semibold hover:no-underline !px-0`}
            size="lg"
            variant="link"
            onClick={() =>
              router.push(`/${lang}/${Routes.AUTH}/${Pages.LOGIN}`)
            }
          >
            {translations.navbar.login}
          </Button>
          <Button
            className="!px-8 !rounded-full cursor-pointer"
            size="lg"
            onClick={() =>
              router.push(`/${lang}/${Routes.AUTH}/${Pages.Register}`)
            }
          >
            {translations.navbar.register}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
