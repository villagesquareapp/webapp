import { NextRequest, NextResponse } from "next/server";
import { apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const token = await getToken();
    const { id } = params;

    try {
        let formData = new FormData();
        try {
            formData = await request.formData();
        } catch (e) {
        }

        const url = new URL(request.url);
        const source = url.searchParams.get("source");
        const endpoint = source === "legacy" ? `posts/vflix/${id}/like` : `vflix/${id}/like`;

        const response = await apiPost<ILikeOrUnlikeVflixResponse>(
            endpoint,
            {
                body: formData,
                isFormData: true
            },
            token
        );
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message || "Failed to like vflix" }, { status: 500 });
    }
}
