"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import EachSocialPost from "components/Dashboard/Social/EachSocialPost";
import { Skeleton } from "components/ui/skeleton";
import { useDataCache } from "context/DataCacheContext";
import { useGuest } from "context/GuestContext";
import Link from "next/link";

interface ProfilePostsProps {
    userId: string;
}

const ProfilePosts = ({ userId }: ProfilePostsProps) => {
    const { getCachedData, setCachedData, isCacheValid } = useDataCache();
    const { isGuest } = useGuest();
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [currentVideoPlaying, setCurrentVideoPlaying] = useState<string>("");
    const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

    const observerTarget = useRef<HTMLDivElement | null>(null);

    const fetchPosts = useCallback(async (pageNumber: number) => {
        if (!userId) return;

        const cacheKey = `profile-posts-${userId}`;
        if (pageNumber === 1) {
            const cached = getCachedData<IPost[]>(cacheKey);
            if (cached && isCacheValid(cacheKey, 5)) {
                setPosts(cached);
                setLoading(false);
                setHasMore(false); // don't trigger more fetches from cache
                return;
            }
        }

        try {
            if (pageNumber === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const res = await fetch(`/api/users/${userId}/posts?page=${pageNumber}`);
            const response = await res.json();

            if (response?.status && response.data) {
                const fetchedPosts = response.data.data;
                const total = response.data.total;

                if (pageNumber === 1) {
                    setPosts(fetchedPosts);
                    setCachedData(`profile-posts-${userId}`, fetchedPosts);
                } else {
                    setPosts((prev) => [...prev, ...fetchedPosts]);
                }

                const currentTotal =
                    pageNumber === 1
                        ? fetchedPosts.length
                        : posts.length + fetchedPosts.length;
                setHasMore(currentTotal < total);
            } else {
                // Suppress toast for guests — they can't view posts without auth
                if (!isGuest) {
                    console.error("Failed to fetch posts:", response?.message);
                }
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching user posts:", error);
            if (!isGuest) {
                console.error("An error occurred while fetching posts");
            }
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [userId]);

    // Initial fetch
    useEffect(() => {
        setPage(1);
        setPosts([]);
        setHasMore(true);
        fetchPosts(1);
    }, [userId, fetchPosts]);

    // Paginate on page change
    useEffect(() => {
        if (page > 1) {
            fetchPosts(page);
        }
    }, [page, fetchPosts]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!hasMore || loading || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            },
            { root: null, rootMargin: "200px", threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading, loadingMore]);

    const likeUnlikePost = async (postId: string) => {
        setPosts((prev) =>
            prev.map((p) => {
                if (p.uuid === postId) {
                    return {
                        ...p,
                        is_liked: !p.is_liked,
                        likes_count: p.is_liked
                            ? String(Number(p.likes_count) - 1)
                            : String(Number(p.likes_count) + 1),
                    };
                }
                return p;
            })
        );
    };

    const saveUnsavePost = async (postId: string) => {
        setPosts((prev) =>
            prev.map((p) => {
                if (p.uuid === postId) {
                    return { ...p, is_saved: !p.is_saved };
                }
                return p;
            })
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 mt-4 w-full">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex flex-col gap-1">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-64 w-full rounded-xl" />
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!loading && posts.length === 0) {
        if (isGuest) {
            return (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
                    <div className="size-14 rounded-full bg-accent flex items-center justify-center">
                        <svg className="size-7 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[15px] font-semibold text-foreground mb-1">Log in to view posts</p>
                        <p className="text-[13px] text-muted-foreground max-w-[240px]">
                            Create an account or log in to see this user's posts.
                        </p>
                    </div>
                    <Link
                        href="/auth/login"
                        className="bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors"
                    >
                        Log in
                    </Link>
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p className="text-sm">No posts yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 mt-4 w-full">
            {posts.map((post) => (
                <EachSocialPost
                    key={post.uuid}
                    user={{} as IUser}
                    setPosts={setPosts}
                    likeUnlikePost={likeUnlikePost}
                    saveUnsavePost={saveUnsavePost}
                    post={post}
                    currentVideoPlaying={currentVideoPlaying}
                    setCurrentVideoPlaying={setCurrentVideoPlaying}
                    isPlayingVideo={isPlayingVideo}
                    setIsPlayingVideo={setIsPlayingVideo}
                    onOpenPostDetails={() => { }}
                    onOpenReplyModal={() => { }}
                />
            ))}

            {/* Infinite scroll sentinel */}
            <div ref={observerTarget} />

            {loadingMore && (
                <div className="flex justify-center py-4">
                    <div className="h-6 w-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default ProfilePosts;
