import { NextRequest, NextResponse } from "next/server";
import { apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const token = await getToken();
    const { id } = params;

    try {
        const response = await apiPost<{ status: boolean; message: string; data: { allow_comments: boolean } }>(
            `vflix/${id}/toggle-comments`,
            {},
            token
        );
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json(
            { status: false, message: error.message || "Failed to toggle comments" },
            { status: 500 }
        );
    }
}
