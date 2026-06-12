import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export async function POST(request: NextRequest) {
    const token = await getToken();
    const body = await request.json();

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/media-processor/upload/presign/complete`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });

    const response = await res.json();
    return NextResponse.json(response);
}
