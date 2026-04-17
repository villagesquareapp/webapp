import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export const dynamic = "force-dynamic";

// GET /api/vflix/[id]/comments?page=1&source=legacy
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = await getToken();
    const { id } = await params;
    const page = request.nextUrl.searchParams.get("page") || "1";
    const source = request.nextUrl.searchParams.get("source");

    const endpoint = source === "legacy"
        ? `${API_URL}/vflix/${id}/comments?page=${page}&source=legacy`
        : `${API_URL}/vflix/${id}/comments?page=${page}`;

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

// POST /api/vflix/[id]/comments — add a comment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const token = await getToken();
    const { id } = await params;
    const source = request.nextUrl.searchParams.get("source");

    const endpoint = source === "legacy"
        ? `${API_URL}/vflix/${id}/comments?source=legacy`
        : `${API_URL}/vflix/${id}/comments`;

    try {
        const body = await request.json();
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
