import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "lib/api";
import { getToken } from "lib/getToken";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "foryou";
    const page = searchParams.get("page") || "1";
    const order = searchParams.get("order") || "latest";
    const location = searchParams.get("location") || "lagos";
    const include = searchParams.get("include") || "livestream,echo,post";

    const token = await getToken();

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("order", order);
    queryParams.append("location", location);
    queryParams.append("include", include);

    const endpoint = type === "following"
        ? `/posts/social/following?${queryParams.toString()}`
        : `/posts/social/foryou?${queryParams.toString()}`;

    const response = await apiGet<IPostsResponse>(endpoint, token);

    return NextResponse.json(response);
}
