import { NextRequest, NextResponse } from "next/server";
import { apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const token = await getToken();

    const response = await apiPost("/vflix/feed/hot/impression", body, token);

    console.log(response);
    

    return NextResponse.json(response);
}
