import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { amountCents, userEmail, userPhone } = await req.json();
    try {
        // 1. Get Auth Token
        const authRes = await axios.post('https://accept.paymob.com/api/auth/tokens', {
            api_key:"ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBMk1qSTVNaXdpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS45Z3VDVF8wRTVVZVhhRUpLeWdDbWtTbE9BenJscDdSNW1RQUJYeGM0MGtWWE03M0YwVnJaVmRfY2toZXNHa0p0ZzkwVmpUWVJXWk9pU2tySlY2eE5vdw==",
        });

        const token = authRes.data.token;
        // 2. Create Order
        const orderRes = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
            auth_token: token,
            delivery_needed: false,
            amount_cents: amountCents,
            currency: 'EGP',
            items: [],
        });

        const orderId = orderRes.data.id;

        // 3. Request Payment Key
        const paymentKeyRes = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
            auth_token: token,
            amount_cents: amountCents,
            expiration: 3600,
            order_id: orderId,
            billing_data: {
                apartment: 'NA',
                email: userEmail,
                floor: 'NA',
                first_name: 'Ahmed',
                street: 'NA',
                building: 'NA',
                phone_number: userPhone,
                shipping_method: 'NA',
                postal_code: 'NA',
                city: 'Cairo',
                country: 'EG',
                last_name: 'Abdelrashed',
                state: 'NA',
            },
            currency: 'EGP',
            integration_id: process.env.PAYMOB_INTEGRATION_ID,
        });

        const iframeToken = paymentKeyRes.data.token;

        const iframeURL = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${iframeToken}`;

        return NextResponse.json({ url: iframeURL });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('Paymob API Error:', axiosError.response?.data || axiosError.message);
            return new NextResponse('فشل في الدفع', { status: 500 });
        }
        return new NextResponse('فشل في الدفع', { status: 500 });
    }
}
