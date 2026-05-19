import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const token = await getToken();

    const url = `${API_URL}/mention-hashtags/autocomplete/hashtags?q=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    const response = await res.json();

    return NextResponse.json(response, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
}
