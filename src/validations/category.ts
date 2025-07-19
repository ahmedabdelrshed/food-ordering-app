import { Translations } from "@/types/translations";
import * as z from "zod";

export const categorySchema = (translations: Translations) => {
    return z.object({
        name: z.string().trim().min(1, {
            message: translations.admin.categories.form.name.validation.required,
        }),
    });
};

export const UpdateCategorySchema = (translations: Translations) => {
    return z.object({
        categoryName: z.string().trim().min(1, {
            message: translations.admin.categories.form.name.validation.required,
        }),
    });
};