"use server"

import { Locale } from "@/i18n.config"
import { db } from "@/lib/prisma"
import getTrans from "@/lib/translation"
import { loginSchema } from "@/validations/auth"
import bcrypt from "bcrypt"
export const login = async (credentials: Record<"email" | "password", string> | undefined, locale: Locale) => {
    const translations = await getTrans(locale);
    const result = loginSchema(translations).safeParse(credentials);
    console.log(result)
    if (!result.success) {
        return {
            error: result.error.flatten().fieldErrors,
            statusCode: 400
        }
    }
    try {
        const existingUser = await db.user.findUnique({
            where: {
                email: result.data.email
            }
        })
        if (!existingUser)
            return {
                message: translations.messages.userNotFound,
                statusCode: 401
            }
        const isPasswordValid = await bcrypt.compare(result.data.password, existingUser.password);
        if (!isPasswordValid) {
            return {
                message: translations.messages.incorrectPassword,
                statusCode: 401
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = existingUser;
        return {
            user: userWithoutPassword,
            statusCode: 200,
            message: translations.messages.loginSuccessful
        }

    } catch (error) {
        console.log(error)
        return {
            message: translations.messages.unexpectedError,
            statusCode: 500
        }
    }
}