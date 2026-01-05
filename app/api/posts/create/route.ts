import { NextRequest, NextResponse } from "next/server";
import { apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export async function POST(request: NextRequest) {
    const token = await getToken();

    try {
        const body = await request.json();
        const response = await apiPost<INewPostResponse>(`/posts/create`, body, token);
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message || "Failed to create post" }, { status: 500 });
    }
}
