import { CartItem } from '@/store/features/cart/cartSlice';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
});

export async function POST(req: Request) {
    const body = await req.json();
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], 
            mode: 'payment', // عملية دفع لمرة واحدة
            line_items: [...body.items.map((item: CartItem) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: [item.image],
                    },
                    unit_amount: (item.price / item.quantity) * 100, // السعر بالسنت (مثلاً 2000 = 20 دولار)
                },
                quantity: item.quantity,
            })), {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Delivery Fee',
                        },
                        unit_amount: 500, // 5 دولار × 100 = 500 سنت
                    },
                    quantity: 1,
                }],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
            metadata: {
                ...body.user, 
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: 'خطأ أثناء إنشاء جلسة الدفع' }, { status: 500 });
    }
}
