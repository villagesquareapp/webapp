import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

export const dynamic = "force-dynamic";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    const { chatId } = await params;
    const token = await getToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/messages/chats/${chatId}/unarchive`, {
        method: "POST",
        headers,
        body: JSON.stringify({}),
        cache: "no-store",
    });
    const response = await res.json();
    return NextResponse.json(response);
}
