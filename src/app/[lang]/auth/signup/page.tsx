import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import RegisterForm from "./_components/RegisterForm";
import Link from "@/components/Link/Link";
import { Pages, Routes } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";

const SignUpPage = async () => {
    const lang = await getCurrentLang();
    const translations = await getTrans(lang);
  return (
    <main>
      <div className="py-44 md:py-15 bg-gray-50 element-center">
        <div className="container element-center">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-black mb-4">
              {translations.auth.register.title}
            </h2>
            <RegisterForm translations={translations} />
            <p className="mt-2 flex items-center justify-center text-accent text-sm">
              <span>{translations.auth.register.authPrompt.message}</span>
              <Link
                href={`/${lang}/${Routes.AUTH}/${Pages.LOGIN}`}
                className={`${buttonVariants({
                  variant: "link",
                  size: "sm",
                })} !text-black`}
              >
                {translations.auth.register.authPrompt.loginLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignUpPage