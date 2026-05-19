import { NextRequest, NextResponse } from "next/server";
<<<<<<< HEAD
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

=======
import { apiGet } from "lib/api";
import { getToken } from "lib/getToken";

>>>>>>> origin/main
export const dynamic = "force-dynamic";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
<<<<<<< HEAD
    const { userId } = await params;

    try {
        let token: string | undefined;
        try {
            token = await getToken() ?? undefined;
        } catch {
            token = undefined;
        }

        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/users/${userId}/profile`, {
            headers,
            cache: "no-store",
        });
        const data = await res.json();
        return NextResponse.json(data);
=======
    const token = await getToken();
    const { userId } = await params;

    try {
        const response = await apiGet<IUserProfileResponse>(`/users/${userId}/profile`, token);
        return NextResponse.json(response);
>>>>>>> origin/main
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
