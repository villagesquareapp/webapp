import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "api/auth/authOptions";
import PublicPostPageClient from "./PublicPostPageClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://staging-api.villagesquare.io/v2";

async function fetchPostPublic(uuid: string): Promise<IPost | null> {
    try {
        const res = await fetch(`${API_URL}/posts/${uuid}`, {
            cache: "no-store",
        });
        const data = await res.json();
        return data?.data ?? null;
    } catch {
        return null;
    }
}

// Dynamic SEO metadata for social sharing
export async function generateMetadata({
    params,
}: {
    params: Promise<{ uuid: string }>;
}): Promise<Metadata> {
    const { uuid } = await params;
    const post = await fetchPostPublic(uuid);

    if (!post) {
        return { title: "Post | VillageSquare" };
    }

    const title = post.user?.name
        ? `${post.user.name} on VillageSquare`
        : "VillageSquare Post";
    const description = post.caption?.slice(0, 160) || "View this post on VillageSquare.";
    const image = Array.isArray(post.media)
        ? post.media[0]?.media_thumbnail || post.media[0]?.media_url || ""
        : (post.media as any)?.media_thumbnail || "";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: image ? [{ url: image }] : [],
            type: "article",
            siteName: "VillageSquare",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: image ? [image] : [],
        },
    };
}

export default async function PublicPostPage({
    params,
}: {
    params: Promise<{ uuid: string }>;
}) {
    const { uuid } = await params;

    const [post, session] = await Promise.all([
        fetchPostPublic(uuid),
        getServerSession(authOptions),
    ]);

    if (!post) notFound();

    return (
        <PublicPostPageClient
            initialPost={post}
            user={session?.user ?? null}
            currentPath={`/post/${uuid}`}
        />
    );
}
