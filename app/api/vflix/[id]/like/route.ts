import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const token = await getToken();
    const { id } = params;

    try {
        const url = new URL(request.url);
        const source = url.searchParams.get("source");
        const endpoint = source === "legacy"
            ? `${API_URL}/vflix/${id}/like?source=legacy`
            : `${API_URL}/vflix/${id}/like`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                // No Content-Type — send no body at all
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { status: false, message: error.message || "Failed to like vflix" },
            { status: 500 }
        );
    }
}
