"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import EachSocialPost from "components/Dashboard/Social/EachSocialPost";
import { getUserPosts } from "api/user";
import { Skeleton } from "components/ui/skeleton";
import { toast } from "sonner";

interface ProfilePostsProps {
    userId: string;
}

const ProfilePosts = ({ userId }: ProfilePostsProps) => {
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

        try {
            if (pageNumber === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await getUserPosts(userId, pageNumber);

            if (response?.status && response.data) {
                const fetchedPosts = response.data.data;
                const total = response.data.total;

                if (pageNumber === 1) {
                    setPosts(fetchedPosts);
                } else {
                    setPosts((prev) => [...prev, ...fetchedPosts]);
                }

                const currentTotal =
                    pageNumber === 1
                        ? fetchedPosts.length
                        : posts.length + fetchedPosts.length;
                setHasMore(currentTotal < total);
            } else {
                toast.error(response?.message || "Failed to fetch posts");
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching user posts:", error);
            toast.error("An error occurred while fetching posts");
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
