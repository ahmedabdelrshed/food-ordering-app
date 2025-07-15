import { Environments, Pages, Routes } from "@/lib/constants";
import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { login } from "./_actions/authActions";
import { Locale } from "@/i18n.config";
export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7, // 7 day  refresh token 
        updateAge: 60 * 60 * 24 // access token  1 day
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === Environments.DEV,
    providers: [Credentials({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "Enter your email" },
            password: { label: "Password", type: "password", placeholder: "  Enter your password" },
        },
        authorize: async (credentials, req) => {
            console.log(credentials)
            const currentUrl = req?.headers?.referer;
            const locale = currentUrl?.split("/")[3] as Locale;
            const res = await login(credentials, locale);
            if (res.statusCode === 200 && res.user) {
                return res.user;
            }
            else {
                throw new Error(JSON.stringify({ validationError: res.error, responseError: res.message, statusCode: res.statusCode }));
            }
        },
    })],
    adapter: PrismaAdapter(db),
    pages: {
        signIn: `/${Routes.AUTH}/${Pages.LOGIN}`
    }

}