// app/api/webhook/route.ts
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
            process.env.STRIPE_WEBHOOK_SECRET! // ← نستخدمه هنا
        );
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log(session.metadata)
            // console.log("✅ تم الدفع بنجاح للـ session:", session.id);
        }

        return new Response('تم الاستلام', { status: 200 });
    } catch (err) {
        console.error("❌ خطأ في Webhook:", err);
        return new Response(`Webhook Error: ${err}`, { status: 400 });
    }
}
