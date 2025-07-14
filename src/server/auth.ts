import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions:NextAuthOptions = {
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
                name:"Ahmed"
            }
        },  
    })]

}