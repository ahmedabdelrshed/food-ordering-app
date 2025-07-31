import { getProductWithSearchPaginated } from "@/server/db/products";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const categoryName = searchParams.get("category") || "";
    const query = searchParams.get("query") || "";
    const cursor = searchParams.get("cursor") || undefined;
    const limit = parseInt(searchParams.get("limit") || "12");

    const data = await getProductWithSearchPaginated({
        categoryName,
        query,
        cursor,
        limit,
    });

    return Response.json(data);
}
