"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { PiHeartFill } from "react-icons/pi";
import { IoChatbubbleEllipses, IoShareSocialOutline } from "react-icons/io5";
import { BsBookmarkFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { ArrowLeft } from "lucide-react";

interface Props {
    initialPost: IPost;
    user: IUser | null;
    currentPath: string;
}

export default function PublicPostPageClient({ initialPost, user, currentPath }: Props) {
    const router = useRouter();
    const isAuthenticated = !!user;

    const [post, setPost] = useState<IPost>(initialPost);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Save redirect path and open login modal
    const requireAuth = useCallback(() => {
        if (isAuthenticated) return true;
        if (typeof window !== "undefined") {
            localStorage.setItem("redirectAfterLogin", currentPath);
        }
        setShowLoginModal(true);
        return false;
    }, [isAuthenticated, currentPath]);

    const handleLike = async () => {
        if (!requireAuth()) return;
        const isLiking = !post.is_liked;
        setPost((prev) => ({
            ...prev,
            is_liked: isLiking,
            likes_count: isLiking
                ? String(Number(prev.likes_count) + 1)
                : String(Math.max(0, Number(prev.likes_count) - 1)),
        }));
        try {
            await fetch(`/api/posts/${post.uuid}/like`, { method: "POST" });
        } catch {
            setPost(initialPost);
        }
    };

    const handleSave = async () => {
        if (!requireAuth()) return;
        setPost((prev) => ({ ...prev, is_saved: !prev.is_saved }));
        try {
            await fetch(`/api/posts/${post.uuid}/save`, { method: "POST" });
        } catch {
            setPost(initialPost);
        }
    };

    const handleComment = () => {
        if (!requireAuth()) return;
        // Authenticated users get redirected to the full post page
        router.push(`/posts/${post.uuid}`);
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/post/${post.uuid}`;
        if (navigator.share) {
            await navigator.share({ title: post.caption || "VillageSquare Post", url });
        } else {
            await navigator.clipboard.writeText(url);
        }
    };

    const mediaItems = Array.isArray(post.media) ? post.media : post.media ? [post.media] : [];

    return (
        <>
            {/* Minimal public navbar */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 h-14">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-5" />
                </button>

                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/vs_logo.png" alt="VillageSquare" width={28} height={28} />
                    <span className="font-bold text-foreground hidden sm:block">VillageSquare</span>
                </Link>

                {isAuthenticated ? (
                    <Link
                        href={`/posts/${post.uuid}`}
                        className="text-sm font-semibold text-[#0D52D2] hover:underline"
                    >
                        Open in app
                    </Link>
                ) : (
                    <Link
                        href={`/auth/login`}
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                localStorage.setItem("redirectAfterLogin", currentPath);
                            }
                        }}
                        className="bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
                    >
                        Log in
                    </Link>
                )}
            </div>

            {/* Post content */}
            <div className="max-w-[600px] mx-auto px-4 py-6">
                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                    <CustomAvatar
                        src={post.user?.profile_picture || ""}
                        name={post.user?.name || ""}
                        className="size-11"
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-foreground text-[15px]">{post.user?.name}</span>
                            {!!post.user?.verified_status && (
                                <HiMiniCheckBadge className="size-4 text-green-500" />
                            )}
                        </div>
                        <span className="text-[13px] text-muted-foreground">@{post.user?.username}</span>
                    </div>
                </div>

                {/* Caption */}
                {post.caption && (
                    <p className="text-[15px] text-foreground leading-relaxed mb-4 whitespace-pre-wrap">
                        {post.caption}
                    </p>
                )}

                {/* Media */}
                {mediaItems.length > 0 && (
                    <div className={`grid gap-1 mb-4 ${mediaItems.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {mediaItems.map((m, i) => (
                            <div key={i} className="rounded-xl overflow-hidden bg-black/10">
                                {m.media_type === "video" ? (
                                    <video
                                        src={m.transcoded_media_url || m.media_url}
                                        className="w-full max-h-[500px] object-cover"
                                        controls
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        src={m.media_url}
                                        alt="post media"
                                        className="w-full max-h-[500px] object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Timestamp */}
                {post.created_at && (
                    <p className="text-[12px] text-muted-foreground mb-4">
                        {new Date(post.created_at).toLocaleString()}
                    </p>
                )}

                {/* Divider */}
                <div className="h-px bg-border mb-3" />

                {/* Action buttons */}
                <div className="flex items-center gap-6">
                    {/* Like */}
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1.5 group"
                        title={isAuthenticated ? "Like" : "Log in to like"}
                    >
                        <PiHeartFill
                            className={`size-5 transition-colors ${
                                post.is_liked ? "text-red-500" : "text-muted-foreground group-hover:text-red-400"
                            }`}
                        />
                        <span className="text-[13px] text-muted-foreground">{post.likes_count ?? 0}</span>
                    </button>

                    {/* Comment */}
                    <button
                        onClick={handleComment}
                        className="flex items-center gap-1.5 group"
                        title={isAuthenticated ? "Comment" : "Log in to comment"}
                    >
                        <IoChatbubbleEllipses className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-[13px] text-muted-foreground">{post.replies_count ?? 0}</span>
                    </button>

                    {/* Save */}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-1.5 group"
                        title={isAuthenticated ? "Save" : "Log in to save"}
                    >
                        <BsBookmarkFill
                            className={`size-4 transition-colors ${
                                post.is_saved ? "text-[#0D52D2]" : "text-muted-foreground group-hover:text-[#0D52D2]"
                            }`}
                        />
                    </button>

                    {/* Share */}
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 group ml-auto"
                        title="Share"
                    >
                        <IoShareSocialOutline className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                </div>

                <div className="h-px bg-border mt-3 mb-6" />

                {/* Guest CTA */}
                {!isAuthenticated && (
                    <div className="bg-accent/50 border border-border rounded-2xl p-5 text-center">
                        <p className="text-[15px] font-semibold text-foreground mb-1">
                            Join the conversation
                        </p>
                        <p className="text-[13px] text-muted-foreground mb-4">
                            Log in or create an account to like, comment, and connect.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Link
                                href="/auth/login"
                                onClick={() => {
                                    if (typeof window !== "undefined") {
                                        localStorage.setItem("redirectAfterLogin", currentPath);
                                    }
                                }}
                                className="bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/auth/register"
                                className="border border-border text-foreground text-[14px] font-medium px-6 py-2.5 rounded-full hover:bg-accent transition-colors"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Login required modal */}
            {showLoginModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowLoginModal(false)}
                >
                    <div
                        className="bg-background border border-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[17px] font-bold text-foreground">Log in to continue</h3>
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="p-1 hover:bg-accent rounded-full transition-colors"
                            >
                                <IoClose className="size-4 text-muted-foreground" />
                            </button>
                        </div>
                        <p className="text-[13px] text-muted-foreground mb-5">
                            You need to be logged in to interact with posts on VillageSquare.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/auth/login"
                                onClick={() => {
                                    if (typeof window !== "undefined") {
                                        localStorage.setItem("redirectAfterLogin", currentPath);
                                    }
                                }}
                                className="w-full text-center bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white font-semibold text-[14px] py-3 rounded-full transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/auth/register"
                                className="w-full text-center border border-border text-foreground font-medium text-[14px] py-3 rounded-full hover:bg-accent transition-colors"
                            >
                                Create account
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
