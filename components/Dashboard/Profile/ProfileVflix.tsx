"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Skeleton } from "components/ui/skeleton";
import { toast } from "sonner";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDataCache } from "context/DataCacheContext";

interface ProfileVflixProps {
    userId: string;
}

const ProfileVflix = ({ userId }: ProfileVflixProps) => {
    const { getCachedData, setCachedData, isCacheValid } = useDataCache();
    const [videos, setVideos] = useState<IVflix[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const router = useRouter();

    const observerTarget = useRef<HTMLDivElement | null>(null);

    const fetchVflix = useCallback(async (pageNumber: number) => {
        if (!userId) return;

        const cacheKey = `profile-vflix-${userId}`;
        if (pageNumber === 1) {
            const cached = getCachedData<IVflix[]>(cacheKey);
            if (cached && isCacheValid(cacheKey, 5)) {
                setVideos(cached);
                setLoading(false);
                setHasMore(false);
                return;
            }
        }

        try {
            if (pageNumber === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const res = await fetch(`/api/users/${userId}/vflix?page=${pageNumber}`);
            const response = await res.json();

            if (response?.status && response.data) {
                const fetchedVideos = response.data.data;
                const total = response.data.total;

                if (pageNumber === 1) {
                    setVideos(fetchedVideos);
                    setCachedData(`profile-vflix-${userId}`, fetchedVideos);
                } else {
                    setVideos((prev) => [...prev, ...fetchedVideos]);
                }

                const currentTotal =
                    pageNumber === 1
                        ? fetchedVideos.length
                        : videos.length + fetchedVideos.length;
                setHasMore(currentTotal < total);
            } else {
                toast.error(response?.message || "Failed to fetch VFlix");
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching user VFlix:", error);
            toast.error("An error occurred while fetching VFlix");
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [userId]);

    // Initial fetch
    useEffect(() => {
        setPage(1);
        setVideos([]);
        setHasMore(true);
        fetchVflix(1);
    }, [userId, fetchVflix]);

    // Paginate on page change
    useEffect(() => {
        if (page > 1) {
            fetchVflix(page);
        }
    }, [page, fetchVflix]);

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

    const formatViews = (count: string) => {
        const num = Number(count);
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
        if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
        return count;
    };

    if (loading) {
        return (
            <div className="grid grid-cols-3 gap-1 mt-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="aspect-[9/16] w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (!loading && videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p className="text-sm">No VFlix videos yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-3 gap-1 mt-2">
                {videos.map((video) => {
                    const mediaArray = Array.isArray(video.media)
                        ? video.media
                        : video.media
                            ? [video.media]
                            : [];
                    const thumbnail = mediaArray[0]?.thumbnail || "";

                    return (
                        <div
                            key={video.uuid}
                            className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer group bg-muted"
                            onClick={() => router.push(`/vflix?v=${video.uuid}`)}
                        >
                            {thumbnail ? (
                                <Image
                                    src={thumbnail}
                                    alt={video.caption || "VFlix"}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    sizes="(max-width: 768px) 33vw, 200px"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <Play className="size-8 text-muted-foreground" />
                                </div>
                            )}

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Views count */}
                            <div className="absolute bottom-2 left-2 flex items-center gap-1">
                                <Play className="size-3 text-white fill-white" />
                                <span className="text-xs text-white font-medium">
                                    {formatViews(video.views_count)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

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

export default ProfileVflix;
