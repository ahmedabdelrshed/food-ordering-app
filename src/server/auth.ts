import { Environments, Pages, Routes } from "@/lib/constants";
import { DefaultSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { login } from "./_actions/authActions";
import { Locale } from "@/i18n.config";
import { User, UserRole } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: User;
    }
  }
declare module "next-auth/jwt" {
    interface JWT extends Partial<User> {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    }
  }
export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, token }) => {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.role = token.role;
                session.user.image = token.image as string;
                session.user.country = token.country as string;
                session.user.city = token.city as string;
                session.user.postalCode = token.postalCode as string;
                session.user.streetAddress = token.streetAddress as string;
                session.user.phone = token.phone as string;
            }
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: token.name,
                    email: token.email,
                    role: token.role,
                    image: token.image,
                },
            };
          },
        jwt: async ({ token }): Promise<JWT> => {
            const dbUser = await db.user.findUnique({
                where: {
                    email: token?.email,
                },
            });
            if (!dbUser) {
                return token;
            }
            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role,
                image: dbUser.image,
                city: dbUser.city,
                country: dbUser.country,
                phone: dbUser.phone,
                postalCode: dbUser.postalCode,
                streetAddress: dbUser.streetAddress,
            };
          },
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7, // 7 day  refresh token 
        updateAge: 60 * 60 * 24 // access token  1 day
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === Environments.DEV,
    providers: [
        Credentials({
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
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    adapter: PrismaAdapter(db),
    pages: {
        signIn: `/${Routes.AUTH}/${Pages.LOGIN}`
    }

}