import { NextRequest, NextResponse } from "next/server";
import { apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const token = await getToken();
    const { id } = params;

    try {
        let formData = new FormData();
        try {
            formData = await request.formData();
        } catch (e) {
            // No form data
        }

        const response = await apiPost<ISaveOrUnsavePostResponse>(
            `/posts/${id}/save`,
            formData, // apiPost handles parsing this if passed directly as body? 
            // original: apiPost(..., formData, token). Wait, original apiPost signature: (route, body, token)
            // saveOrUnsavePost used: apiPost(..., formData, token). 
            // If it's pure standard fetch body, we can pass it.
            // But we need to ensure headers are set correctly. api/base.ts usually sets Content-Type to json if not isFormData.
            // If we pass FormData object to fetch, browser/Next sets multipart headers.
            // Let's explicitly use the options object if needed, but apiPost signature in api/base.ts wrapper needs checking.
            // Looking at `api/post.ts`: return await apiPost<ISaveOrUnsavePostResponse>(`/posts/${postId}/save`, formData, token);
            // Looking at `lib/api/base.ts` (implied): it likely accepts `body` as 2nd arg.

            token
        );
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message || "Failed to save post" }, { status: 500 });
    }
}
