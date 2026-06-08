import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const page = searchParams.get("page") || "1";

    const token = await getToken();

    const queryParams = new URLSearchParams();
    queryParams.append("query", query);
    queryParams.append("page", page);

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/messages/chats?${queryParams.toString()}`, {
        headers,
        cache: "no-store",
    });

    const response = await res.json();

    return NextResponse.json(response, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
}
