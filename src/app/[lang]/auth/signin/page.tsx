import Link from "@/components/Link/Link";
import {  buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import React from "react";
import LoginForm from "./_Components/LoginForm";

const SigninPage = async () => {
  const lang = await getCurrentLang();
  const translations = await getTrans(lang);
  return (
    <main>
      <div className="py-44 md:py-30 bg-gray-50 element-center">
        <div className="container element-center">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-black mb-4">
              {translations.auth.login.title}
            </h2>
            <LoginForm translations={translations} />
            <p className="mt-2 flex items-center justify-center text-accent text-sm">
              <span>{translations.auth.login.authPrompt.message}</span>
              <Link
                href={`/${lang}/${Routes.AUTH}/${Pages.Register}`}
                className={`${buttonVariants({
                  variant: "link",
                  size: "sm",
                })} !text-black`}
              >
                {translations.auth.login.authPrompt.signUpLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SigninPage;
