"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VflixCard from "./VFlixCard";
import { getVflixPosts, likeOrUnlikeVflix } from "api/vflix";
import { toast } from "sonner";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import NotFoundResult from "../Reusable/NotFoundResult";

interface Props {
  activeTab: "for-you" | "following";
  user: IUser;
}

export default function VflixFeed({ activeTab, user }: Props) {
  const [videos, setVideos] = useState<IVflix[]>([]);
  const [page, setPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <div className="flex items-center gap-6">
      {/* Left Arrow */}
      {currentIndex > 0 && (
        <button
          onClick={prevVideo}
          className="p-2 rounded-full bg-black/50 hover:bg-black/70 z-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Video Card */}
      <div className="relative w-[400px] h-[700px] rounded-xl shadow-lg overflow-hidden">
        {videos[currentIndex] && (
          <VflixCard
            post={videos[currentIndex]}
            user={user}
            setVideos={setVideos}
            likeUnlikeVflix={likeUnlikeVflix}
          />
        )}
        {loading && <LoadingSpinner />}
      </div>

      {/* Right Arrow */}
      <button
        onClick={nextVideo}
        className="p-2 rounded-full bg-black/50 hover:bg-black/70 z-20"
        disabled={loading}
      >
        {loading ? null : <ChevronRight className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
}
