"use server";
import { Pages, Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { categorySchema, UpdateCategorySchema } from "@/validations/category";
import { revalidatePath } from "next/cache";

export const addCategory = async (prevState: unknown, formData: FormData) => {
    const locale = await getCurrentLang();
    const translations = await getTrans(locale);
    const result = categorySchema(translations).safeParse(
        Object.fromEntries(formData.entries())
    );
    if (result.success === false) {
        return {
            error: result.error.flatten().fieldErrors,
            status: 400,
        };
    }
    const data = result.data;

    try {
        await db.category.create({
            data,
        });
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
        revalidatePath(`/${locale}/${Routes.MENU}`);

        return {
            status: 201,
            message: translations.messages.categoryAdded,
        };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }
};

export const updateCategory = async (
    id: string,
    prevState: unknown,
    formData: FormData
) => {
    const locale = await getCurrentLang();
    const translations = await getTrans(locale);
    const result = UpdateCategorySchema(translations).safeParse(
        Object.fromEntries(formData.entries())
    );
    if (result.success === false) {
        return {
            error: result.error.flatten().fieldErrors,
            status: 400,
        };
    }
    const data = result.data;

    try {
        await db.category.update({
            where: {
                id,
            },
            data: {
                name: data.categoryName,
            },
        });
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
        revalidatePath(`/${locale}/${Routes.MENU}`);

        return {
            status: 200,
            message: translations.messages.updatecategorySucess,
        };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }
};


export const deleteCategory = async (id: string) => {
    const locale = await getCurrentLang();
    const translations = await getTrans(locale);

    try {
        await db.category.delete({
            where: {
                id,
            },
        });
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
        revalidatePath(`/${locale}/${Routes.MENU}`);

        return {
            status: 200,
            message: translations.messages.deleteCategorySucess,
        };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }
};