import { NextRequest, NextResponse } from "next/server";
import { apiGet } from "lib/api";
import { getToken } from "lib/getToken";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const token = await getToken();

    try {
        const response = await apiGet<any>("/users/suggestions", token);
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error fetching user suggestions:", error);
        return NextResponse.json(
            { status: false, message: "Failed to fetch user suggestions" },
            { status: 500 }
        );
    }
}
