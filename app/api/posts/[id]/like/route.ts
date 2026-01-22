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
