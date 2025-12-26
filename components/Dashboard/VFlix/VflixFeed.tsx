"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VflixCard from "./VFlixCard";
import { getVflixPosts, likeOrUnlikeVflix } from "api/vflix";
import { toast } from "sonner";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import NotFoundResult from "../Reusable/NotFoundResult";
import VflixComments from "./VflixComments";
import VFlixSkeleton from "./VFlixSkeleton";

interface Props {
  activeTab: "for-you" | "following";
  user: IUser;
}

export default function VflixFeed({ activeTab, user }: Props) {
  const [videos, setVideos] = useState<IVflix[]>([]);
  const [page, setPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const toggleComments = (postId: string | null = null) => {
    // If the panel is open, close it. Otherwise, open it for the given postId.
    if (isCommentsOpen) {
      setIsCommentsOpen(false);
      setActivePostId(null);
    } else {
      setIsCommentsOpen(true);
      setActivePostId(postId);
    }
  };

  const likeUnlikeVflix = async (postId: string) => {
    const formData = new FormData();
    const result = await likeOrUnlikeVflix(postId, formData);
    if (result?.status) {
      setVideos((prev) =>
        prev.map((post) =>
          post.uuid === postId
            ? {
              ...post,
              likes_count: result?.data?.is_liked
                ? (Number(post.likes_count) + 1).toString()
                : (Number(post.likes_count) - 1).toString(),
              is_liked: !post.is_liked,
            }
            : post
        )
      );
    } else {
      toast.error(result?.message);
    }
  };

  useEffect(() => {
    async function fetchVflixVideos() {
      try {
        setLoading(true);
        const response = await getVflixPosts(page);
        if (page === 1) {
          setVideos(response.data?.data || []);
          setCurrentIndex(0);
        } else {
          setVideos((prev) => [...prev, ...(response.data?.data ?? [])]);
        }
      } catch (error) {
        console.error("Failed to fetch Vflix posts: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVflixVideos();
  }, [page, activeTab]);

  const prevVideo = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));

  const nextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // reached end → load next page
      setPage((prev) => prev + 1);
    }
  };

  if (videos.length === 0 && !loading) {
    return (
      <NotFoundResult
        content={<span>No posts available at the moment.</span>}
      />
    );
  }

  const currentPost = videos[currentIndex];

  return (
    <div className="flex items-center justify-center gap-0 md:gap-6 w-full max-w-full px-2 md:px-0 relative">
      {/* Left Arrow */}
      {currentIndex > 0 && (
        <button
          onClick={prevVideo}
          className="absolute left-4 md:static p-2 rounded-full bg-black/50 hover:bg-black/70 z-50 md:z-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Video Card */}
      <div className="relative w-full md:w-[550px] h-[calc(100vh-140px)] md:h-[85vh] rounded-xl shadow-lg overflow-hidden flex-shrink-0">
        {videos[currentIndex] && (
          <VflixCard
            post={videos[currentIndex]}
            user={user}
            setVideos={setVideos}
            likeUnlikeVflix={likeUnlikeVflix}
            onCommentClick={() => toggleComments(currentPost.uuid)}
          />
        )}
        {loading && videos.length === 0 && <VFlixSkeleton />}
        {loading && videos.length > 0 && <LoadingSpinner />}
      </div>

      {/* Right Arrow */}
      <button
        onClick={nextVideo}
        className="absolute right-4 md:static p-2 rounded-full bg-black/50 hover:bg-black/70 z-50 md:z-20"
        disabled={loading}
      >
        {loading ? null : <ChevronRight className="w-6 h-6 text-white" />}
      </button>
      <VflixComments isOpen={isCommentsOpen} onClose={toggleComments} postId={activePostId} user={user} />
    </div>
  );
}
