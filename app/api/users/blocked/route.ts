import { NextResponse } from "next/server";
import { apiGet } from "lib/api";
import { getToken } from "lib/getToken";

export const dynamic = "force-dynamic";

export async function GET() {
    const token = await getToken();
    try {
        const response = await apiGet<any>(`/users/blocked`, token);
        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
