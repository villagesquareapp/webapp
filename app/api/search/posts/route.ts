import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
    const q = request.nextUrl.searchParams.get("q") || "";
    const page = request.nextUrl.searchParams.get("page") || "1";
    const token = await getToken();

    try {
        const res = await fetch(`${API_URL}/search/posts?q=${encodeURIComponent(q)}&page=${page}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
