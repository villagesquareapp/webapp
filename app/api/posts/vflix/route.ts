import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "lib/api";
import { getToken } from "lib/getToken";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";

    const token = await getToken();

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);

    const endpoint = `/posts/vflix/foryou?${queryParams.toString()}`;

    const response = await apiGet<IVFlixResponse>(endpoint, token);

    return NextResponse.json(response);
}
