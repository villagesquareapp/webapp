import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    try {
        // Reverse geocode
        if (lat && lon) {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
            const res = await fetch(url, {
                headers: {
                    "User-Agent": "VillageSquareApp/1.0",
                    "Accept-Language": "en",
                },
                next: { revalidate: 0 },
            });
            const data = await res.json();
            return NextResponse.json(data);
        }

        // Forward search
        if (!q?.trim()) {
            return NextResponse.json([]);
        }

        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "VillageSquareApp/1.0",
                "Accept-Language": "en",
            },
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            return NextResponse.json([], { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json([], { status: 500 });
    }
}
