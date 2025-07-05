"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Languages } from "@/lib/constants";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {  lang } = useParams();

  const switchLanguage = (newLocale: string) => {
    const path =
      pathname?.replace(`/${lang}`, `/${newLocale}`) ?? `/${newLocale}`;
    router.push(path);
  };

  return (
    <div className="flex">
      {lang === Languages.ARABIC ? (
        <Button
          variant="outline"
          onClick={() => switchLanguage(Languages.ENGLISH)}
          className="cursor-pointer hover:!bg-primary hover:text-primary-foreground"
        >
          English
        </Button>
      ) : (
        <Button
          variant="outline"
          className="cursor-pointer hover:!bg-primary hover:text-primary-foreground"
          onClick={() => switchLanguage(Languages.ARABIC)}
        >
          العربية
        </Button>
      )}
    </div>
  );
};

export default LanguageSwitcher;
