"use server";
import { Pages, Routes } from "@/lib/constants";
import { getCurrentLang } from "@/lib/getCurrentLang";
import { getImageUrl } from "@/lib/getImageUrl";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { addProductSchema, updateProductSchema } from "@/validations/product";
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

export const updateProduct = async (args: {
    productId: string
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
}, _prevState: unknown, formData: FormData) => {

    const locale = await getCurrentLang();
    const translations = await getTrans(locale);
    const result = updateProductSchema(translations).safeParse(
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
    const imageUrl = Boolean(imageFile.size)
        ? await getImageUrl(imageFile, "product_images") as string
        : undefined;
    const product = await db.product.findUnique({
        where: { id: args.productId },
    });

    if (!product) {
        return {
            status: 400,
            message: translations.messages.unexpectedError,
        };
    }
    try {

        await db.product.update({
            where: {
                id: args.productId
            },
            data: {
                ...data,
                basePrice,
                image: imageUrl ? imageUrl : product.image,
                sizes: {
                    deleteMany: {},
                    createMany: {
                        data: args.options.sizes.map((size) => ({
                            name: size.name as ProductSizes,
                            price: Number(size.price),
                        })),
                    }
                },
                extras: {
                    deleteMany: {},
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
        revalidatePath(
            `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${product.id}/${Pages.EDIT}`
        );
        revalidatePath(`/${locale}`);
        return {
            status: 200,
            message: translations.messages.updateProductSucess,
        };

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }


}

export const deleteProduct = async ( productId: string ) => {
    const locale = await getCurrentLang();
    const translations = await getTrans(locale);
    try {
        await db.product.delete({
            where: { id: productId }
        });
        revalidatePath(`/${locale}/${Routes.MENU}`);
        revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
        revalidatePath(
            `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${productId}/${Pages.EDIT}`
        );
        revalidatePath(`/${locale}`);
        return {
            status: 200,
            message: translations.messages.deleteProductSucess,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: translations.messages.unexpectedError,
        };
    }
}