"use client";

import Image from "next/image";
import { likePost, unlikePost, savePost, unsavePost, sharePost, getPosts } from "app/api/post";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@radix-ui/react-separator";
import PostVideo from "./PostVideo";
import SocialPostActionButtons from "./SocialPostActionButtons";
import PostText from "./PostText";
import PostHeader from "./PostHeader";
import SocialPostFilterDialog from "./SocialPostFilterDialog";
import EachSocialPost from "./EachSocialPost";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import NotFoundResult from "../Reusable/NotFoundResult";

const SocialPost = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts({
        order: "latest",
        location: "lagos",
        include: "livestream,echo,post",
        page,
      });

      const posts = response?.data?.data;
      if (posts?.length) {
        if (page === 1) {
          setPosts(posts);
        } else {
          setPosts((prev) => [...prev, ...posts]);
        }
        setHasMore(posts?.length === response?.data?.total);
      } else {
        toast.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("An error occurred while fetching posts");
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer setup
  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        {
          root: null,
          rootMargin: "200px",
          threshold: 0.1,
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="border-b-[1.5px] flex justify-between">
        <div className="flex flex-row">
          {/* @Todo Font is bold and primary border when selected */}
          <span className="py-3 px-5 text-lg border-b-4 border-primary">For You</span>
          <span className="py-3 px-5 text-lg">Following</span>
        </div>
        <SocialPostFilterDialog />
      </div>
      {loading && <LoadingSpinner />}

      {!loading && posts?.length > 0 && (
        <div className="border rounded-xl flex flex-col gap-y-4 py-4 ">
          {/* Post */}

          {posts?.map((post, index) => {
            if (posts?.length === index + 1) {
              return (
                <div className="flex flex-col gap-y-4 py-4" ref={lastPostRef} key={post.uuid}>
                  <EachSocialPost key={post.uuid} post={post} />
                </div>
              );
            }
            return <EachSocialPost key={post.uuid} post={post} />;
          })}
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
