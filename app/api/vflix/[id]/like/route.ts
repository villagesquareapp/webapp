import { NextRequest, NextResponse } from "next/server";
import { apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const token = await getToken();
    const { id } = params;

    try {
        const url = new URL(request.url);
        const source = url.searchParams.get("source");
        const endpoint = source === "legacy"
            ? `vflix/${id}/like?source=legacy`
            : `vflix/${id}/like`;

        const response = await apiPost<ILikeOrUnlikeVflixResponse>(endpoint, {}, token);
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message || "Failed to like vflix" }, { status: 500 });
    }
}
