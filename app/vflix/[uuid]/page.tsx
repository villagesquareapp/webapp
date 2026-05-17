import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import PublicLayout from "components/Layouts/PublicLayout";
import PublicVflixPageClient from "./PublicVflixPageClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

async function fetchVflixPublic(uuid: string, token?: string): Promise<IVflix | null> {
    try {
        const headers: HeadersInit = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/vflix/${uuid}`, {
            headers,
            cache: "no-store",
        });
        const data = await res.json();
        return data?.status && data?.data ? data.data : null;
    } catch {
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ uuid: string }>;
}): Promise<Metadata> {
    const { uuid } = await params;
    const video = await fetchVflixPublic(uuid);

    if (!video) return { title: "VFlix | VillageSquare" };

    const creatorName = video.user?.name ?? "Someone";
    const title = `${creatorName} on VillageSquare VFlix`;
    const description = video.caption?.slice(0, 160) || `Watch this VFlix video by ${creatorName} on VillageSquare.`;

    const mediaItem = Array.isArray(video.media) ? video.media[0] : video.media;
    const thumbnail = mediaItem?.thumbnail || mediaItem?.media_thumbnail || mediaItem?.media_url || "";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: thumbnail ? [{ url: thumbnail }] : [],
            type: "video.other",
            siteName: "VillageSquare",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: thumbnail ? [thumbnail] : [],
        },
    };
}

export default async function PublicVflixPage({
    params,
}: {
    params: Promise<{ uuid: string }>;
}) {
    const { uuid } = await params;

    const [session] = await Promise.all([getServerSession(authOptions)]);
    const token = session?.user?.token;

    // Authenticated users → redirect to in-app vflix feed
    if (session?.user) {
        redirect(`/vflix?v=${uuid}`);
    }

    // Fetch without auth for guests; with auth if somehow session exists
    const video = await fetchVflixPublic(uuid, token);

    if (!video) notFound();

    const currentPath = `/vflix/${uuid}`;

    return (
        <PublicLayout currentPath={currentPath}>
            <PublicVflixPageClient
                initialVideo={video}
                currentPath={currentPath}
            />
        </PublicLayout>
    );
}
