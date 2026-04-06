"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VflixCard from "./VFlixCard";
import { likeOrUnlikeVflix } from "api/vflix";
import { toast } from "sonner";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import NotFoundResult from "../Reusable/NotFoundResult";
import VflixComments from "./VflixComments";
import VFlixSkeleton from "./VFlixSkeleton";
import { useDataCache } from "context/DataCacheContext";

interface Props {
  activeTab: "explore" | "connections";
  user: IUser;
  onVideosLoaded?: (videos: IVflix[]) => void;
  selectedVideo?: IVflix;
}

export default function VflixFeed({ activeTab, user, onVideosLoaded, selectedVideo }: Props) {
  const { getCachedData, setCachedData, isCacheValid } = useDataCache();

  const [videos, setVideos] = useState<IVflix[]>([]);
  const [page, setPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activePostSource, setActivePostSource] = useState<string | undefined>(undefined);

  // Jump to selected video when triggered from HotOnVflix
  useEffect(() => {
    if (selectedVideo) {
      const existingIndex = videos.findIndex(v => v.uuid === selectedVideo.uuid);
      if (existingIndex !== -1) {
        // Video already in feed, jump to it
        if (existingIndex !== currentIndex) {
          setDirection(existingIndex > currentIndex ? 1 : -1);
          setCurrentIndex(existingIndex);
        }
      } else {
        // Video not in feed, prepend it and jump to index 0
        const updated = [selectedVideo, ...videos];
        setVideos(updated);
        onVideosLoaded?.(updated);
        setDirection(-1);
        setCurrentIndex(0);
      }
    }
  }, [selectedVideo]);

  // Check cache on mount
  useEffect(() => {
    const cacheKey = `vflix-videos-${activeTab}`;
    const cachedVideos = getCachedData<IVflix[]>(cacheKey);

    if (cachedVideos && isCacheValid(cacheKey, 5)) {
      // Use cached data if it's less than 5 minutes old
      setVideos(cachedVideos);
      onVideosLoaded?.(cachedVideos);
      setLoading(false);
    } else {
      // Fetch fresh data if cache is invalid or doesn't exist
      fetchVflixVideos();
    }
  }, [activeTab]);

  // Only fetch more when page changes (not on initial mount)
  useEffect(() => {
    if (page > 1) {
      fetchVflixVideos();
    }
  }, [page]);

  const toggleComments = (postId: string | null = null, source?: string) => {
    if (isCommentsOpen) {
      setIsCommentsOpen(false);
      setActivePostId(null);
      setActivePostSource(undefined);
    } else {
      setIsCommentsOpen(true);
      setActivePostId(postId);
      setActivePostSource(source);
    }
  };

  const likeUnlikeVflix = async (postId: string, source?: string) => {
    // 1. Optimistic Update
    setVideos((prev) =>
      prev.map((post) => {
        if (post.uuid === postId) {
          const newIsLiked = !post.is_liked;
          const currentCount = Number(post.likes_count) || 0;
          const newCount = newIsLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
          return {
            ...post,
            is_liked: newIsLiked,
            likes_count: newCount.toString(),
          };
        }
        return post;
      })
    );

    try {
      let result;

      if (source === "legacy") {
        result = await likeOrUnlikeVflix(postId);
      } else {
        const url = `/api/vflix/${postId}/like`;
        const res = await fetch(url, { method: "POST" });
        result = await res.json();
      }

      if (!result?.status) {
        toast.error("Failed to like video");
        // Revert optimistic update on failure
        setVideos((prev) =>
          prev.map((post) => {
            if (post.uuid === postId) {
              const revertedIsLiked = !post.is_liked;
              const currentCount = Number(post.likes_count) || 0;
              const newCount = revertedIsLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
              return {
                ...post,
                is_liked: revertedIsLiked,
                likes_count: newCount.toString(),
              };
            }
            return post;
          })
        );
      }
    } catch (e) {
      console.error("Vflix like error", e);
      toast.error("An error occurred while liking the video");
      // Revert optimistic update on error
      setVideos((prev) =>
        prev.map((post) => {
          if (post.uuid === postId) {
            const revertedIsLiked = !post.is_liked;
            const currentCount = Number(post.likes_count) || 0;
            const newCount = revertedIsLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
            return {
              ...post,
              is_liked: revertedIsLiked,
              likes_count: newCount.toString(),
            };
          }
          return post;
        })
      );
    }
  };

  const fetchVflixVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        mode: activeTab,
      });
      const res = await fetch(`/api/vflix?${params.toString()}`);
      const response = await res.json();

      if (response?.status) {
        if (page === 1) {
          const newVideos = response.data?.data || [];
          setVideos(newVideos);
          setCurrentIndex(0);
          onVideosLoaded?.(newVideos);
          // Cache the first page of videos
          const cacheKey = `vflix-videos-${activeTab}`;
          setCachedData(cacheKey, newVideos);
        } else {
          setVideos((prev) => {
            const updated = [...prev, ...(response.data?.data ?? [])];
            onVideosLoaded?.(updated);
            return updated;
          });
        }
      } else {
        console.error("Failed to fetch Vflix posts: ", response?.message);
        toast.error(response?.message || "Failed to load Vflix posts");
      }
    } catch (error) {
      console.error("Failed to fetch Vflix posts: ", error);
      toast.error("An error occurred while fetching Vflix posts");
    } finally {
      setLoading(false);
    }
  };

  const prevVideo = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextVideo = () => {
    setDirection(1);
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        prevVideo();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        nextVideo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, videos.length, loading]);

  if (videos.length === 0 && !loading) {
    return (
      <NotFoundResult
        content={<span>No posts available at the moment.</span>}
      />
    );
  }

  const currentPost = videos[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="flex items-center justify-center w-full h-full relative gap-10">
      <div className="relative w-full max-w-[450px] md:w-[450px] h-[calc(100vh-180px)] md:h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex-shrink-0 bg-black">
        <AnimatePresence initial={false} custom={direction}>
          {videos[currentIndex] && (
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 w-full h-full"
            >
              <VflixCard
                post={videos[currentIndex]}
                user={user}
                setVideos={setVideos}
                likeUnlikeVflix={likeUnlikeVflix}
                onCommentClick={() => toggleComments(currentPost.uuid, currentPost._source)}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {loading && videos.length === 0 && <VFlixSkeleton />}
        {loading && videos.length > 0 && <LoadingSpinner />}
      </div>

      {/* Vertical Navigation Arrows */}
      <div className="hidden md:flex flex-col gap-4">
        <button
          onClick={prevVideo}
          disabled={currentIndex === 0}
          className={`p-3 rounded-full flex items-center justify-center transition-colors ${currentIndex > 0 ? "bg-[#131B2B] hover:bg-[#1A2438] text-white" : "bg-[#131B2B]/50 text-gray-600 cursor-not-allowed"
            }`}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button
          onClick={nextVideo}
          disabled={loading}
          className={`p-3 rounded-full flex items-center justify-center transition-colors ${!loading ? "bg-[#131B2B] hover:bg-[#1A2438] text-white" : "bg-[#131B2B]/50 text-gray-600 cursor-not-allowed"
            }`}
        >
          {loading ? null : <ChevronDown className="w-6 h-6" />}
        </button>
      </div>

      <VflixComments isOpen={isCommentsOpen} onClose={toggleComments} postId={activePostId} source={activePostSource} user={user} />
    </div>
  );
}
