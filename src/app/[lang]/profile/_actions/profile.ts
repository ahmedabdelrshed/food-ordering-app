"use server";
import { Pages, Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import { getImageUrl } from "@/lib/getImageUrl";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { updateProfileSchema } from "@/validations/profile";
import { revalidatePath } from "next/cache";

export const updateProfile = async (_prevState: unknown, formData: FormData) => {
    const locale = await getCurrentLang();
    const translations = await getTrans(locale);
    const result = updateProfileSchema(translations).safeParse(
        Object.fromEntries(formData.entries())
    );
    if (!result.success) {
        return {
            error: result.error.flatten().fieldErrors,
            formData
        }
    }
    const data = result.data;
    const imageFile = data.image as File;
    const imageUrl = Boolean(imageFile.size)
        ? await getImageUrl(imageFile,"profile_images")
        : undefined;
    try {
        const user = await db.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (!user) {
            return {
                message: translations.messages.userNotFound,
                status: 401,
                formData,
            };
        }
        await db.user.update({
            where: {
                email: user.email,
            },
            data: {
                ...data,
                image: imageUrl ?? user.image,
            },
        });
        revalidatePath(`/${locale}/${Routes.PROFILE}`);
        revalidatePath(`/${locale}/${Routes.ADMIN}`);
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
        revalidatePath(
            `/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`
        );
        return {
            status: 200,
            message: translations.messages.updateProfileSucess,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }
}


