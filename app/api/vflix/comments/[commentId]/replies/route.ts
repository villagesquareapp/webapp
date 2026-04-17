import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export const dynamic = "force-dynamic";

// GET /api/vflix/comments/[commentId]/replies?postId=&page=1&source=legacy
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ commentId: string }> }
) {
    const token = await getToken();
    const { commentId } = await params;
    const page = request.nextUrl.searchParams.get("page") || "1";
    // const postId = request.nextUrl.searchParams.get("postId") || "";
    const source = request.nextUrl.searchParams.get("source");

    const endpoint = source === "legacy"
        ? `${API_URL}/vflix/comments/${commentId}/replies?page=${page}&source=legacy`
        : `${API_URL}/vflix/comments/${commentId}/replies?page=${page}`;

    try {
        const res = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
