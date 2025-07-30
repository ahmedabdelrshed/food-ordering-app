// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/server/db/orders';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const result = await getOrders({
            page,
            limit,
            search
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
