import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export const dynamic = "force-dynamic";

// Public endpoint — no auth required, used for shared post links
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const res = await fetch(`${API_URL}/posts/${id}`, {
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { status: false, message: error.message || "Failed to fetch post" },
            { status: 500 }
        );
    }
}
