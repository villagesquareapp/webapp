import { NextRequest, NextResponse } from "next/server";
import { apiPut } from "lib/api";
import { getToken } from "lib/getToken";

export async function PUT(request: NextRequest) {
    const token = await getToken();

    if (!token) {
        return NextResponse.json(
            { status: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const response = await apiPut<{ status: boolean; message: string }>(
            "users/settings/password/update",
            body,
            token
        );
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json(
            { status: false, message: error.message || "Failed to update password" },
            { status: 500 }
        );
    }
}
