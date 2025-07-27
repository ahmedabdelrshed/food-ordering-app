"use server";
import { getCurrentLang } from "@/lib/getCurrentLang";
import getTrans from "@/lib/translation";
import { CartItem } from "@/store/features/cart/cartSlice";
import { checkoutSchema } from "@/validations/checkout";
import { Session } from "next-auth";

export const checkoutAction = async (args: { session: Session, items: CartItem[] }, _prevState: unknown, formData: FormData) => {
    const locale = await getCurrentLang();
    const translations = await getTrans(locale);
    const result = checkoutSchema(translations).safeParse(
        Object.fromEntries(formData.entries())
    );
    if (!result.success) {
        return {
            error: result.error.flatten().fieldErrors,
            formData,
        }
    }
    try {
        console.log(process.env.NEXT_PUBLIC_BASE_URL)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: args.items, user: {
                    ...args.session?.user,
                    phone: result.data.phone,
                    streetAddress: result.data.streetAddress,
                    city: result.data.city,
                    postalCode: result.data.postalCode,
                }
            }),
        });

        const data = await res.json();
        return {
            status: 200,
            message: data.url as string,
        }
    } catch (error) {
        console.error(error);
        return {
            message: translations.messages.unexpectedError,
            status: 500,
            formData
        };
    }
}