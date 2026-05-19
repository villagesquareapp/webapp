import { NextRequest, NextResponse } from "next/server";
<<<<<<< HEAD
import { getToken } from "lib/getToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

=======
import { apiGet } from "lib/api";
import { getToken } from "lib/getToken";

>>>>>>> origin/main
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
<<<<<<< HEAD
    const token = await getToken();

    const url = `${API_URL}/mention-hashtags/autocomplete/hashtags?q=${encodeURIComponent(query)}`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    const response = await res.json();

    return NextResponse.json(response, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
=======

    const token = await getToken();

    // Route matches: /v2/mention-hashtags/autocomplete/hashtags?q={search}
    const endpoint = `/mention-hashtags/autocomplete/hashtags?q=${encodeURIComponent(query)}`;

    const response = await apiGet(endpoint, token);

    return NextResponse.json(response);
>>>>>>> origin/main
}
