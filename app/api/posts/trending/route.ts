import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "lib/api";
import { getToken } from "lib/getToken";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const window = searchParams.get("window") || "24h";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const token = await getToken();

    const queryParams = new URLSearchParams();
    queryParams.append("window", window);
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    const endpoint = `/posts/trending?${queryParams.toString()}`;

    try {
        const response = await apiGet<any>(endpoint, token);
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching trending posts:", error);
        return NextResponse.json(
            { status: false, message: "Failed to fetch trending posts" },
            { status: 500 }
        );
    }
}
