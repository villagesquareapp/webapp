import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ chatId: string }> }
) {
    const { chatId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const lastMessageId = searchParams.get("last_message_id") || "";
    const messageType = searchParams.get("message_type") || "";

    const token = await getToken();

    const queryParams = new URLSearchParams();
    if (lastMessageId) queryParams.append("last_message_id", lastMessageId);
    if (messageType) queryParams.append("message_type", messageType);

    const url = `${API_URL}/messages/chats/${chatId}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        headers,
        cache: "no-store",
    });

    const response = await res.json();

    return NextResponse.json(response, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
}
