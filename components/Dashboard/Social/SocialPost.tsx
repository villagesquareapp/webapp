"use client";

import { getPosts, likeOrUnlikePost, saveOrUnsavePost } from "app/api/post";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import NotFoundResult from "../Reusable/NotFoundResult";
import EachSocialPost from "./EachSocialPost";
import SocialPostFilterDialog from "./SocialPostFilterDialog";

const SocialPost = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const likeUnlikePost = async (postId: string) => {
    const formData = new FormData();
    const result = await likeOrUnlikePost(postId, formData);
    if (result?.status) {
      setPosts((prev) =>
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

  const saveUnsavePost = async (postId: string) => {
    const formData = new FormData();
    const result = await saveOrUnsavePost(postId, formData);
    if (result?.status) {
      setPosts((prev) =>
        prev.map((post) =>
          post.uuid === postId
            ? {
                ...post,
                is_saved: !post?.is_saved,
              }
            : post
        )
      );
    } else {
      toast.error(result?.message);
    }
  };

  const fetchPosts = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getPosts({
        order: "latest",
        location: "lagos",
        include: "livestream,echo,post",
        page: pageNumber,
      });

      const newPosts = response?.data?.data;
      if (Array.isArray(newPosts)) {
        if (pageNumber === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        // Check if we have more posts to load
        const totalPosts = response?.data?.total || 0;
        const currentTotal =
          (pageNumber - 1) * (response?.data?.per_page || 10) + newPosts.length;
        setHasMore(currentTotal < totalPosts);
      } else {
        toast.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("An error occurred while fetching posts");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Intersection Observer setup
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
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

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="border-b-[1.5px] flex justify-between">
        <div className="flex flex-row">
          <span className="py-3 px-5 text-lg border-b-4 border-primary">For You</span>
          <span className="py-3 px-5 text-lg">Following</span>
        </div>
        <SocialPostFilterDialog />
      </div>

      {loading && <LoadingSpinner />}

      {!loading && posts?.length > 0 && (
        <div className="border rounded-xl flex flex-col gap-y-4 py-4">
          {posts.map((post) => (
            <EachSocialPost
              likeUnlikePost={likeUnlikePost}
              saveUnsavePost={saveUnsavePost}
              key={post.uuid}
              post={post}
            />
          ))}

          {/* Observer target */}
          <div ref={observerTarget} style={{ height: "10px" }} />

          {/* Loading more indicator */}
          {loadingMore && (
            <div className="py-4 text-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      )}

      {!loading && posts?.length === 0 && (
        <NotFoundResult content={<span>No posts available at the moment.</span>} />
      )}

      {!loading && !hasMore && posts?.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">No more posts to load</div>
      )}
    </div>
  );
};

export default SocialPost;
