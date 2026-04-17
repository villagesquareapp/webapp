import { NextRequest, NextResponse } from "next/server";

const PHOTON_URL = "https://photon.komoot.io";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    try {
        // Reverse geocode — use Nominatim (more reliable for reverse)
        if (lat && lon) {
            const url = `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lon}&format=json`;
            const res = await fetch(url, {
                headers: {
                    "User-Agent": "VillageSquare/1.0 (admin@villagesquare.io)",
                    "Accept-Language": "en",
                    "Referer": "https://villagesquare.io",
                },
                cache: "no-store",
            });
            const data = await res.json();
            return NextResponse.json(data);
        }

        // Forward search — use Photon (no rate limits, production-safe)
        if (!q?.trim()) {
            return NextResponse.json([]);
        }

        const photonUrl = `${PHOTON_URL}/api?q=${encodeURIComponent(q)}&limit=6&lang=en`;
        const res = await fetch(photonUrl, {
            headers: {
                "User-Agent": "VillageSquare/1.0 (admin@villagesquare.io)",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            // Fallback to Nominatim if Photon fails
            return await nominatimSearch(q);
        }

        const photonData = await res.json();

        // Photon returns GeoJSON — convert to Nominatim-compatible format
        const results = (photonData.features || []).map((f: any, i: number) => ({
            place_id: i,
            display_name: buildDisplayName(f),
            lat: String(f.geometry?.coordinates?.[1] ?? ""),
            lon: String(f.geometry?.coordinates?.[0] ?? ""),
        }));

        return NextResponse.json(results);
    } catch (error) {
        // Final fallback to Nominatim
        if (q?.trim()) {
            return await nominatimSearch(q);
        }
        return NextResponse.json([], { status: 500 });
    }
}

async function nominatimSearch(q: string): Promise<NextResponse> {
    try {
        const url = `${NOMINATIM_URL}/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "VillageSquare/1.0 (admin@villagesquare.io)",
                "Accept-Language": "en",
                "Referer": "https://villagesquare.io",
            },
            cache: "no-store",
        });
        const data = await res.json();
        return NextResponse.json(Array.isArray(data) ? data : []);
    } catch {
        return NextResponse.json([]);
    }
}

function buildDisplayName(feature: any): string {
    const p = feature.properties || {};
    const parts = [
        p.name,
        p.street,
        p.housenumber,
        p.city || p.town || p.village,
        p.state,
        p.country,
    ].filter(Boolean);
    return parts.join(", ") || "Unknown location";
}
