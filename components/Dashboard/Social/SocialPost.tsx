"use client";

import {
  getPostComments,
} from "app/api/post";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import NotFoundResult from "../Reusable/NotFoundResult";
import EachSocialPost from "./EachSocialPost";
import SocialPostFilterDialog from "./SocialPostFilterDialog";
import AddPost from "./AddPost";
import PostDetails from "./PostDetails";
import ReplyToPostModal from "./ReplyToPostModal";
import PostSkeleton from "./PostSkeleton";
import ProgressBar from "./ProgressBar";

type TabType = "explore" | "connections";

const SocialPost = ({ user }: { user: IUser }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMorePost, setLoadingMorePost] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("explore");

  const [currentVideoPlaying, setCurrentVideoPlaying] = useState<string>("");
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const [postForReplyModal, setPostForReplyModal] = useState<IPost | null>(
    null
  );
  const [replyToReply, setReplyToReply] = useState<IPostComment | null>(null);

  const [replies, setReplies] = useState<IPostComment[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState<boolean>(false);

  const scrollRef = useRef(0);

  const likeUnlikePost = useCallback(async (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.uuid === postId
          ? {
            ...post,
            likes_count: post?.is_liked
              ? (Number(post.likes_count) - 1).toString()
              : (Number(post.likes_count) + 1).toString(),
            is_liked: !post.is_liked,
          }
          : post
      )
    );

    try {
      // const formData = new FormData();
      // const result = await likeOrUnlikePost(postId, formData);
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      const result = await res.json();

      if (!result?.status) {
        setPosts((prev) =>
          prev.map((post) =>
            post.uuid === postId
              ? {
                ...post,
                likes_count: post.is_liked
                  ? (Number(post.likes_count) + 1).toString()
                  : (Number(post.likes_count) - 1).toString(),
                is_liked: !post.is_liked,
              }
              : post
          )
        );
        toast.error(result?.message || "Failed to update like");
      }
    } catch (error) {
      setPosts((prev) =>
        prev.map((post) =>
          post.uuid === postId
            ? {
              ...post,
              likes_count: post.is_liked
                ? (Number(post.likes_count) + 1).toString()
                : (Number(post.likes_count) - 1).toString(),
              is_liked: !post.is_liked,
            }
            : post
        )
      );
      console.error("Error liking post:", error);
    }
  }, []);

  const saveUnsavePost = async (postId: string) => {
    // const formData = new FormData();
    // const result = await saveOrUnsavePost(postId, formData);
    try {
      const res = await fetch(`/api/posts/${postId}/save`, { method: "POST" });
      const result = await res.json();

      if (result?.status) {
        setPosts((prev) =>
          prev.map((post) =>
            post.uuid === postId ? { ...post, is_saved: !post?.is_saved } : post
          )
        );
      } else {
        toast.error(result?.message || "Failed to save post");
      }
    } catch (e) {
      console.error("Error saving post", e);
      toast.error("Failed to save post");
    }
  };

  const fetchPosts = async (pageNumber: number, tab: TabType = activeTab) => {
    try {
      if (pageNumber === 1) {
        setIsPostLoading(true);
      } else {
        setLoadingMorePost(true);
      }

      const params = new URLSearchParams({
        order: "latest",
        location: "lagos",
        include: "livestream,echo,post",
        page: pageNumber.toString(),
        type: tab === "explore" ? "foryou" : "following",
      });

      const res = await fetch(`/api/posts/social?${params.toString()}`);

      let response: any = null;
      try {
        response = await res.json();
      } catch (e) {
        console.error("Failed to parse JSON", e);
      }

      if (!response) {
        toast.error("Failed to load posts: No response from server");
        setIsPostLoading(false);
        setLoadingMorePost(false);
        return;
      }

      if (!response.status) {
        toast.error(response.message || "Failed to load posts");
        console.error("API Error:", response.message);
        setIsPostLoading(false);
        setLoadingMorePost(false);
        return;
      }

      const postsData = response.data;
      const newPosts = postsData?.data;

      if (Array.isArray(newPosts)) {
        if (pageNumber === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        const totalPosts = postsData?.total || 0;
        const currentTotal =
          (pageNumber - 1) * (postsData?.per_page || 10) + newPosts.length;
        setHasMore(currentTotal < totalPosts);
      } else {
        toast.error("Failed to load posts: Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("An error occurred while fetching posts");
    } finally {
      setIsPostLoading(false);
      setLoadingMorePost(false);
    }
  };

  useEffect(() => {
    fetchPosts(page, activeTab);
  }, [page, activeTab]);

  const observerTarget = useRef(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!selectedPost) {
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isPostLoading &&
          !loadingMorePost
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );
    observerRef.current = observer;

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [hasMore, isPostLoading, loadingMorePost, selectedPost]);

  const videoElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const visibilityMapRef = useRef<Map<string, number>>(new Map());
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-media-id");
          if (!id) return;
          visibilityMapRef.current.set(id, entry.intersectionRatio);
        });

        let bestId = "";
        let bestRatio = 0;
        for (const [id] of videoElementsRef.current.entries()) {
          const ratio = visibilityMapRef.current.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestRatio >= 0.6) {
          if (bestId !== currentVideoPlaying) {
            setCurrentVideoPlaying(bestId);
            setIsPlayingVideo(true);
          }
        } else {
          if (currentVideoPlaying) {
            setCurrentVideoPlaying("");
            setIsPlayingVideo(false);
          }
        }
      },
      { threshold: thresholds }
    );

    return () => {
      intersectionObserverRef.current?.disconnect();
    };
  }, []);

  const registerVideoRef = useCallback((id: string, el: HTMLElement | null) => {
    const observer = intersectionObserverRef.current;
    if (el) {
      el.setAttribute("data-media-id", id);
      videoElementsRef.current.set(id, el);
      visibilityMapRef.current.set(id, 0);
      if (observer) observer.observe(el);
    } else {
      const prev = videoElementsRef.current.get(id);
      if (prev && observer) observer.unobserve(prev);
      videoElementsRef.current.delete(id);
      visibilityMapRef.current.delete(id);
    }
  }, []);

  const handleOpenPost = (post: IPost) => {
    setIsPlayingVideo(false);
    setCurrentVideoPlaying("");
    scrollRef.current = window.scrollY;
    setSelectedPost(post);
    setPostForReplyModal(null);
    setIsReplyModalOpen(false);
    setReplyToReply(null);
  };

  const handleBack = () => {
    setSelectedPost(null);
    setReplyToReply(null);
    setTimeout(() => {
      window.scrollTo(0, scrollRef.current);
    }, 0);
  };

  const handleOpenReplyModal = (post: IPost, replyToComment?: IPostComment) => {
    setIsPlayingVideo(false);
    setCurrentVideoPlaying("");
    setPostForReplyModal(post);
    setReplyToReply(replyToComment || null);
    setIsReplyModalOpen(true);
  };

  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
    setPostForReplyModal(null);
    setReplyToReply(null);
  };

  const handleReplySuccess = (newReply: IPostComment) => {
    // Optimistically update the replies count in the main posts list
    setPosts((prev) =>
      prev.map((p) =>
        p.uuid === postForReplyModal?.uuid
          ? {
            ...p,
            replies_count: (Number(p.replies_count) + 1).toString(),
            replies: p.caption ? [...p.caption, newReply] : [newReply],
          }
          : p
      )
    );
    if (selectedPost && selectedPost.uuid === postForReplyModal?.uuid) {
      setSelectedPost(prev => prev ? {
        ...prev,
        replies_count: (Number(prev.replies_count) + 1).toString(),
      } : null);
    }
    handleCloseReplyModal();
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
    setPosts([]);
    setHasMore(true);
  };

  return (
    <>
    {/* <ProgressBar progress={50} /> */}
      {selectedPost ? (
        <PostDetails
          post={selectedPost}
          user={user}
          setPosts={setPosts}
          onBack={handleBack}
          likeUnlikePost={likeUnlikePost}
          saveOrUnsavePost={saveUnsavePost}
          currentVideoPlaying={currentVideoPlaying}
          setCurrentVideoPlaying={setCurrentVideoPlaying}
          isPlayingVideo={isPlayingVideo}
          setIsPlayingVideo={setIsPlayingVideo}
          onOpenReplyModal={handleOpenReplyModal}
          onReplySuccess={handleReplySuccess}
        />
      ) : (
        <>
          <AddPost
            user={user}
            onRefreshPosts={() => fetchPosts(1, activeTab)}
          />

          <div className="flex flex-col gap-y-2">
            {/* Header with tabs - Responsive */}
            <div className="border-b-[1.5px] flex justify-between sticky top-16 -mt-4 bg-background z-10 md:static md:top-0">
              <div className="flex flex-row w-full md:w-auto">
                <button
                  onClick={() => handleTabChange("explore")}
                  className={`flex-1 md:flex-none px-6 py-3 text-sm font-medium transition-colors ${activeTab === "explore"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Explore
                </button>
                <button
                  onClick={() => handleTabChange("connections")}
                  className={`flex-1 md:flex-none px-6 py-3 text-sm font-medium transition-colors ${activeTab === "connections"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Connections
                </button>
              </div>
              <div className="hidden md:flex items-center">
                <SocialPostFilterDialog />
              </div>
            </div>

            {isPostLoading && (
              <div className="border-0 md:border md:rounded-xl flex flex-col gap-y-0 md:gap-y-4 py-0 md:py-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <PostSkeleton key={index} />
                ))}
              </div>
            )}

            {!isPostLoading && posts?.length > 0 && (
              <div className="border-0 md:border md:rounded-xl flex flex-col gap-y-0 md:gap-y-4 py-0 md:py-4">
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
                    onOpenPostDetails={() => handleOpenPost(post)}
                    onOpenReplyModal={() => handleOpenReplyModal(post)}
                  />
                ))}

                <div ref={observerTarget} style={{ height: "10px" }} />
                {loadingMorePost && (
                  <div className="py-4 text-center">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
            )}

            {!isPostLoading && posts?.length === 0 && (
              <NotFoundResult
                content={<span>No posts available at the moment.</span>}
              />
            )}

            {!isPostLoading && !hasMore && posts?.length > 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No more posts to load
              </div>
            )}
          </div>
        </>
      )}

      {isReplyModalOpen && postForReplyModal && (
        <ReplyToPostModal
          open={isReplyModalOpen}
          onClose={handleCloseReplyModal}
          post={postForReplyModal}
          user={user}
          setPosts={setPosts}
          replyToComment={replyToReply}
          onReplySuccess={handleReplySuccess}
          isInPostDetails={!!selectedPost}
        />
      )}
    </>
  );
};

export default SocialPost;
