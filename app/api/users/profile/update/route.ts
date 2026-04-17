import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export async function PUT(request: NextRequest) {
    const token = await getToken();

    try {
        const formData = await request.formData();

        const response = await fetch(`${API_URL}/users/profile/update`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                // No Content-Type — let fetch set it automatically for FormData (includes boundary)
            },
            body: formData,
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { status: false, message: error.message || "Failed to update profile" },
            { status: 500 }
        );
    }
}
