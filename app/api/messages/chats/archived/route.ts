import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export async function GET(request: NextRequest) {
    const token = await getToken();

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/messages/chats/archived`, {
        headers,
        cache: "no-store",
    });

    const response = await res.json();

    return NextResponse.json(response, {
        headers: { "Cache-Control": "no-store" },
    });
}
