"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import EachSocialPost from "components/Dashboard/Social/EachSocialPost";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import { useRouter } from "next/navigation";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { toast } from "sonner";

type Tab = "posts" | "accounts";

export default function SearchResultsClient({ user }: { user: IUser }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";

    const [activeTab, setActiveTab] = useState<Tab>("posts");
    const [posts, setPosts] = useState<IPost[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [loadingAccounts, setLoadingAccounts] = useState(false);

    const [currentVideoPlaying, setCurrentVideoPlaying] = useState("");
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);

    // Track which query the current data belongs to
    const [fetchedQuery, setFetchedQuery] = useState<{ posts: string; accounts: string }>({ posts: "", accounts: "" });

    const fetchPosts = useCallback(async () => {
        if (!query) return;
        setLoadingPosts(true);
        try {
            const res = await fetch(`/api/search/posts?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data?.status && data?.data?.results) {
                setPosts(data.data.results);
            }
        } catch (e) {
            console.error("Search posts error:", e);
        } finally {
            setLoadingPosts(false);
            setFetchedQuery((prev) => ({ ...prev, posts: query }));
        }
    }, [query]);

    const fetchAccounts = useCallback(async () => {
        if (!query) return;
        setLoadingAccounts(true);
        try {
            const res = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data?.status && data?.data?.results) {
                setAccounts(data.data.results);
            }
        } catch (e) {
            console.error("Search accounts error:", e);
        } finally {
            setLoadingAccounts(false);
            setFetchedQuery((prev) => ({ ...prev, accounts: query }));
        }
    }, [query]);

    useEffect(() => {
        if (!query) return;
        // Fetch only if data hasn't been fetched for this query yet
        if (activeTab === "posts" && fetchedQuery.posts !== query && !loadingPosts) fetchPosts();
        if (activeTab === "accounts" && fetchedQuery.accounts !== query && !loadingAccounts) fetchAccounts();
    }, [activeTab, query, fetchPosts, fetchAccounts, fetchedQuery, loadingPosts, loadingAccounts]);

    // Like/unlike post
    const likeUnlikePost = useCallback(async (postId: string) => {
        setPosts((prev) =>
            prev.map((post) =>
                post.uuid === postId
                    ? {
                        ...post,
                        likes_count: post.is_liked
                            ? String(Math.max(0, Number(post.likes_count) - 1))
                            : String(Number(post.likes_count) + 1),
                        is_liked: !post.is_liked,
                    }
                    : post
            )
        );
        try {
            const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
            const result = await res.json();
            if (!result?.status) {
                // Revert on failure
                setPosts((prev) =>
                    prev.map((post) =>
                        post.uuid === postId
                            ? {
                                ...post,
                                likes_count: post.is_liked
                                    ? String(Math.max(0, Number(post.likes_count) - 1))
                                    : String(Number(post.likes_count) + 1),
                                is_liked: !post.is_liked,
                            }
                            : post
                    )
                );
                toast.error(result?.message || "Failed to like post");
            }
        } catch {
            // Revert on error
            setPosts((prev) =>
                prev.map((post) =>
                    post.uuid === postId
                        ? {
                            ...post,
                            likes_count: post.is_liked
                                ? String(Math.max(0, Number(post.likes_count) - 1))
                                : String(Number(post.likes_count) + 1),
                            is_liked: !post.is_liked,
                        }
                        : post
                )
            );
        }
    }, []);

    // Save/unsave post
    const saveUnsavePost = useCallback(async (postId: string) => {
        try {
            const res = await fetch(`/api/posts/${postId}/save`, { method: "POST" });
            const result = await res.json();
            if (result?.status) {
                setPosts((prev) =>
                    prev.map((post) =>
                        post.uuid === postId
                            ? { ...post, is_saved: !post.is_saved }
                            : post
                    )
                );
            } else {
                toast.error(result?.message || "Failed to save post");
            }
        } catch {
            toast.error("Failed to save post");
        }
    }, []);

    // Follow/unfollow account
    const handleFollow = async (userId: string) => {
        setAccounts((prev) =>
            prev.map((a) => a.uuid === userId ? { ...a, is_followed: !a.is_followed } : a)
        );
        try {
            await fetch(`/api/users/${userId}/follow`, { method: "POST" });
        } catch { }
    };

    return (
        <div className="flex flex-col w-full max-w-[700px] h-full overflow-y-auto no-scrollbar px-4 lg:px-6 pt-4 pb-8 border-r border-border">
            {/* Query display */}
            {query && (
                <p className="text-muted-foreground text-sm mb-4">
                    Search results for <span className="text-foreground font-semibold">&ldquo;{query}&rdquo;</span>
                </p>
            )}

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border mb-1 sticky -top-5 bg-background z-10 pt-1">
                {(["posts", "accounts"] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 text-sm font-medium capitalize transition-all border-b-2 ${
                            activeTab === tab
                                ? "border-[#0D52D2] text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Posts tab */}
            {activeTab === "posts" && (
                <>
                    {loadingPosts ? (
                        <div className="flex flex-col gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="size-10 rounded-full" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-48 w-full rounded-xl" />
                                </div>
                            ))}
                        </div>
                    ) : posts.length > 0 ? (
                        <div className="flex flex-col">
                            {posts.map((post) => (
                                <EachSocialPost
                                    key={post.uuid}
                                    user={user}
                                    setPosts={setPosts}
                                    likeUnlikePost={likeUnlikePost}
                                    saveUnsavePost={saveUnsavePost}
                                    post={post}
                                    currentVideoPlaying={currentVideoPlaying}
                                    setCurrentVideoPlaying={setCurrentVideoPlaying}
                                    isPlayingVideo={isPlayingVideo}
                                    setIsPlayingVideo={setIsPlayingVideo}
                                    onOpenPostDetails={() => router.push(`/posts/${post.uuid}`)}
                                    onOpenReplyModal={() => router.push(`/posts/${post.uuid}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12 text-sm">
                            No posts found for &ldquo;{query}&rdquo;
                        </div>
                    )}
                </>
            )}

            {/* Accounts tab */}
            {activeTab === "accounts" && (
                <>
                    {loadingAccounts ? (
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="size-11 rounded-full" />
                                        <div className="flex flex-col gap-1">
                                            <Skeleton className="h-4 w-28" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-8 w-20 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : accounts.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {accounts.map((account) => (
                                <div
                                    key={account.uuid}
                                    className="flex items-center justify-between py-2 hover:bg-accent/30 -mx-2 px-2 rounded-lg transition-colors"
                                >
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => router.push(`/u/${account.username}`)}
                                    >
                                        <CustomAvatar
                                            src={account.profile_picture || ""}
                                            name={account.name || ""}
                                            className="size-11"
                                        />
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[14px] font-bold text-foreground hover:underline">
                                                    {account.name}
                                                </span>
                                                {!!account.is_verified && (
                                                    <HiMiniCheckBadge className="size-4 text-green-500" />
                                                )}
                                            </div>
                                            <span className="text-[13px] text-muted-foreground">
                                                @{account.username}
                                            </span>
                                            {account.bio && (
                                                <span className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">
                                                    {account.bio}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => handleFollow(account.uuid)}
                                        className={`h-8 rounded-full px-5 text-xs font-semibold ${
                                            account.is_followed
                                                ? "bg-transparent border border-border text-foreground hover:bg-accent"
                                                : "bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white"
                                        }`}
                                    >
                                        {account.is_followed ? "Following" : "Follow"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12 text-sm">
                            No accounts found for &ldquo;{query}&rdquo;
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
