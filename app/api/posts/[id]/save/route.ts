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
            // No form data
        }

        const response = await apiPost<ISaveOrUnsavePostResponse>(
            `/posts/${id}/save`,
            formData,

            token
        );
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message || "Failed to save post" }, { status: 500 });
    }
}
