import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import PublicLayout from "components/Layouts/PublicLayout";
import PublicPostPageClient from "./PublicPostPageClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";
const PUBLIC_API_TOKEN = process.env.PUBLIC_API_TOKEN;

async function fetchPostPublic(uuid: string, token?: string): Promise<IPost | null> {
    try {
        const authToken = token || PUBLIC_API_TOKEN;
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

        const res = await fetch(`${API_URL}/posts/${uuid}`, {
            headers,
            cache: "no-store",
        });
        const data = await res.json();
        return data?.data ?? null;
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
    const post = await fetchPostPublic(uuid);
    if (!post) return { title: "Post | VillageSquare" };

    const title = post.user?.name ? `${post.user.name} on VillageSquare` : "VillageSquare Post";
    const description = post.caption?.slice(0, 160) || "View this post on VillageSquare.";
    const image = Array.isArray(post.media)
        ? post.media[0]?.media_thumbnail || post.media[0]?.media_url || ""
        : (post.media as any)?.media_thumbnail || "";

    return {
        title,
        description,
        openGraph: { title, description, images: image ? [{ url: image }] : [], type: "article", siteName: "VillageSquare" },
        twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
    };
}

export default async function PublicPostPage({
    params,
}: {
    params: Promise<{ uuid: string }>;
}) {
    const { uuid } = await params;

    const [post, session] = await Promise.all([
        fetchPostPublic(uuid, undefined), // fetch without token first to resolve session
        getServerSession(authOptions),
    ]);

    // Re-fetch with token if authenticated so the response includes is_liked, is_saved etc.
    const finalPost = session?.user?.token
        ? await fetchPostPublic(uuid, session.user.token) ?? post
        : post;

    if (!finalPost) notFound();

    const currentPath = `/post/${uuid}`;

    return (
        <PublicLayout currentPath={currentPath}>
            <PublicPostPageClient
                initialPost={finalPost}
                user={session?.user ?? null}
                currentPath={currentPath}
            />
        </PublicLayout>
    );
}
