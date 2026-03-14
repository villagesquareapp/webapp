import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "lib/api";
import { getToken } from "lib/getToken";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const mode = searchParams.get("mode") || "explore"; // default to explore

    const token = await getToken();

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("from_search_id", "d0796b85-b598-4541-a49a-17bf49f69e99");
    queryParams.append("language", "en");
    queryParams.append("culture_tag", "lifestyle");

    const endpoint = `/vflix/feed/${mode}?${queryParams.toString()}`;

    const response = await apiGet<IVFlixResponse>(endpoint, token);

    return NextResponse.json(response);
}
