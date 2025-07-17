import { getCurrentLang } from "@/lib/getCurrentLang";
import Link from "../Link/Link";
import CartButton from "./CartButton";
import Navbar from "./Navbar";
import getTrans from "@/lib/translation";
import LanguageSwitcher from "./LanguageSwitcher";
import AuthButtons from "./AuthButtons";
import { getServerSession } from "next-auth";

const Header = async () => {
  const lang = await getCurrentLang();
  const translations = await getTrans(lang);
  const initialSession = await getServerSession();
  return (
    <header className="py-4 md:py-6">
      <div className="container flex items-center justify-between gap-6 lg:gap-10">
        <Link href={`/${lang}`} className="text-primary font-semibold text-2xl">
          🍕 {translations.logo}
        </Link>
        <div className="flex items-center gap-4">
          <Navbar translations={translations} initialSession={initialSession} />
          <AuthButtons
            translations={translations}
            initialSession={initialSession}
          />
          <CartButton />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
