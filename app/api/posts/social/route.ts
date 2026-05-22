import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "foryou";
    const page = searchParams.get("page") || "1";
    const order = searchParams.get("order") || "latest";
    const location = searchParams.get("location") || "";
    const include = searchParams.get("include") || "";

    const token = await getToken();

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("order", order);
    if (location) queryParams.append("location", location);
    if (include) queryParams.append("include", include);
    // Cache-bust to prevent Next.js fetch deduplication
    queryParams.append("_t", Date.now().toString());

    const endpoint = type === "following"
        ? `/posts/social/following?${queryParams.toString()}`
        : `/posts/social/foryou?${queryParams.toString()}`;

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${endpoint}`, {
        headers,
        cache: "no-store",
        next: { revalidate: 0 },
    });

    const response = await res.json();

    return NextResponse.json(response, {
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    });
}
