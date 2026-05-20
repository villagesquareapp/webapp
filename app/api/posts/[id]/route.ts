import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Supports both authenticated and unauthenticated access
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Try to get token — will be null/undefined if unauthenticated
        let token: string | undefined;
        try {
            token = await getToken() ?? undefined;
        } catch {
            token = undefined;
        }

        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/posts/${id}`, {
            headers,
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
