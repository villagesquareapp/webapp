import { NextRequest, NextResponse } from "next/server";
import { apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const token = await getToken();
    const { id } = params;

    try {
        // The previous implementation used clean formData, passing an empty object/formData is fine if the API just toggles based on URL or ignores body.
        // However, the original code passed formData. Let's try to pass it if present.
        // Actually, likeOrUnlikePost in api/post.ts takes optional formData. Most "like" endpoints don't need body.
        // We will pass an empty object as body if none provided, or verify if the API expects formData.
        // Looking at api/post.ts: body: formData, isFormData: true.

        // We'll read formData from request if it exists, otherwise empty.
        let formData = new FormData();
        try {
            formData = await request.formData();
        } catch (e) {
            // No form data, ignore
        }

        const response = await apiPost<ILikeOrUnlikePostResponse>(
            `/posts/${id}/like`,
            {
                body: formData,
                isFormData: true
            },
            token
        );
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message || "Failed to like post" }, { status: 500 });
    }
}
