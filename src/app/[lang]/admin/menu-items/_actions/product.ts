"use server";
import { Pages, Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import { getImageUrl } from "@/lib/getImageUrl";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { addProductSchema } from "@/validations/product";
import { Extra, ExtraIngredients, ProductSizes, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addProduct = async (args: {
    categoryId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
}, _prevState: unknown, formData: FormData) => {
    const locale = await getCurrentLang();
    const translations = await getTrans(locale);
    const result = addProductSchema(translations).safeParse(
        Object.fromEntries(formData.entries())
    );
    if (result.success === false) {
        return {
            error: result.error.flatten().fieldErrors,
            status: 400,
            formData
        };
    }
    const data = result.data;
    const basePrice = Number(data.basePrice);
    const imageFile = data.image as File;
    const imageUrl = await getImageUrl(imageFile, "product_images") as string;
    try {
        await db.product.create({
            data: {
                ...data,
                basePrice,
                image: imageUrl,
                categoryId: args.categoryId,
                sizes: {
                    createMany: {
                        data: args.options.sizes.map((size) => ({
                            name: size.name as ProductSizes,
                            price: Number(size.price),
                        })),
                    }
                },
                extras: {
                    createMany: {
                        data: args.options.extras.map((extra) => ({
                            name: extra.name as ExtraIngredients,
                            price: Number(extra.price),
                        })),
                    }
                }
            }
        })
        revalidatePath(`/${locale}/${Routes.MENU}`);
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
        revalidatePath(`/${locale}`);
        return {
            status: 201,
            message: translations.messages.productAdded,
        };

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }

}