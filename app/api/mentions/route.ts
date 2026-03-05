import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "lib/api";
import { getToken } from "lib/getToken";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    const token = await getToken();

    // Route matches: /v2/mention-hashtags/autocomplete/mentions?q={search}
    const endpoint = `/mention-hashtags/autocomplete/mentions?q=${encodeURIComponent(query)}`;

    const response = await apiGet(endpoint, token);

    return NextResponse.json(response);
}
