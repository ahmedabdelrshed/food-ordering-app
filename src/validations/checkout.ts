import { Translations } from "@/types/translations";
import { z } from "zod";
export const checkoutSchema = (translations: Translations) => {
    return z.object({
        phone: z
            .string()
            .trim()
            .min(1, { message: translations.profile.form.phone.validation?.required })
            .refine(
                (value) => {
                    if (!value) return true;
                    return /^\+?[1-9]\d{1,14}$/.test(value);
                },
                {
                    message: translations.profile.form.phone.validation?.invalid,
                }
            ),
        streetAddress: z.string().trim().min(1, {
            message: translations.profile.form.address.validation?.required,
        }),
        postalCode: z
            .string()
            .trim()
            .min(1, {
                message: translations.profile.form.postalCode.validation?.required,
            })
            .refine(
                (value) => {
                    if (!value) return true;
                    return /^\d{5,10}$/.test(value);
                },
                {
                    message: translations.profile.form.postalCode.validation?.invalid,
                }
            ),
        city: z.string().trim().min(1, {
            message: translations.profile.form.city.validation?.required,
        }),
    });
}