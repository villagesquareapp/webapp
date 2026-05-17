import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export const dynamic = "force-dynamic";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // No auth header for guests — backend supports public access on /vflix/:uuid
        let token: string | undefined;
        try { token = (await getToken()) ?? undefined; } catch { token = undefined; }

        const headers: HeadersInit = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/vflix/${id}`, {
            headers,
            cache: "no-store",
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { status: false, message: error.message || "Failed to fetch vflix" },
            { status: 500 }
        );
    }
}
