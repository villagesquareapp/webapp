import { NextRequest, NextResponse } from "next/server";
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ keyword: string }> }
) {
    const { keyword } = await params;
    const token = await getToken();
    try {
        const res = await fetch(`${API_URL}/search/recent/remove/${encodeURIComponent(keyword)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
