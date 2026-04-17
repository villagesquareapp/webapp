import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export const dynamic = "force-dynamic";

// POST /api/vflix/comments/[commentId]/like?source=legacy
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ commentId: string }> }
) {
    const token = await getToken();
    const { commentId } = await params;
    const source = request.nextUrl.searchParams.get("source");

    const endpoint = source === "legacy"
        ? `${API_URL}/vflix/comments/${commentId}/like?source=legacy`
        : `${API_URL}/vflix/comments/${commentId}/like`;

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
