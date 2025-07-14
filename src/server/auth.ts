import { Environments, Pages, Routes } from "@/lib/constants";
import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7, // 7 day  refresh token 
        updateAge: 60 * 60 * 24 // access token  1 day
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug:process.env.NODE_ENV === Environments.DEV ,
    providers: [Credentials({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "Enter your email" },
            password: { label: "Password", type: "password", placeholder: "  Enter your password" },
        },
        authorize(credentials) {
            console.log(credentials)
            return {
                id: crypto.randomUUID(),
                email: credentials?.email,
                image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
                name: "Ahmed"
            }
        },
    })],
    adapter: PrismaAdapter(db),
    pages: {
        signIn:`/${Routes.AUTH}/${Pages.LOGIN}`
    }

}