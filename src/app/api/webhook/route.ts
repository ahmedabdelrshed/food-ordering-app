// app/api/webhook/route.ts
import { db } from '@/lib/prisma';
import { Extra } from '@prisma/client';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
});
export const config = {
    api: {
        bodyParser: false,
    },
};
export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature')!;
    const body = await req.text(); 

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET! 
        );
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log(session.metadata)
            const session_data = await stripe.checkout.sessions.retrieve(event.data.object.id, {
                expand: ['line_items', 'line_items.data.price.product'],
            });
            const itemsData = session_data.line_items?.data.slice(0, -1).map((item) => {
                const product = item.price?.product as Stripe.Product;
                const productId = product.metadata.productId;
                const extras = JSON.parse(product.metadata.extras || '[]');
                const sizeId = product.metadata.sizeId;
                return {
                    productId,
                    sizeId,
                    extras,
                    quantity: item.quantity as number,
                    price: (item.price?.unit_amount as number) / 100,
                };
            }) || [];           
             await db.order.create({
                data: {
                    user: { connect: { email: session.metadata?.email as string } },
                    items: {
                        create: itemsData?.map((item) => ({
                            product: { connect: { id: item.productId } },
                            size: { connect: { id: item.sizeId } },
                            quantity: item.quantity,
                            price: item.price,
                            extras: {
                                connect: item.extras.map((extra:Extra) => ({
                                    id: extra.id
                                }))
                            }
                        })),
                    }
                }
            });
        }
        return new Response('تم الاستلام', { status: 200 });

    } catch (err) {
        console.error("❌ خطأ في Webhook:", err);
        return new Response(`Webhook Error: ${err}`, { status: 400 });
    }
}
