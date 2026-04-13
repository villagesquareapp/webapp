import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "lib/api";
import { getToken } from "lib/getToken";

export const dynamic = "force-dynamic";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const token = await getToken();
    const { userId } = await params;
    const page = request.nextUrl.searchParams.get("page") || "1";

    try {
        const response = await apiGet<IPostsResponse>(`/users/${userId}/posts/liked?page=${page}`, token);
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
