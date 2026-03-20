import { NextRequest, NextResponse } from "next/server";
import { apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export const dynamic = 'force-dynamic';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const token = await getToken();
    const { userId } = await params;

    try {
        const response = await apiPost<any>(`/users/${userId}/unfollow`, {}, token);
        return NextResponse.json(response);
    } catch (error) {
        console.error(`Error unfollowing user ${userId}:`, error);
        return NextResponse.json(
            { status: false, message: "Failed to unfollow user" },
            { status: 500 }
        );
    }
}
