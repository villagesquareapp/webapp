"use client";

import { getPostComments } from "app/api/post";
import { useCallback, useEffect, useRef, useState } from "react";
import { Separator } from "components/ui/separator";
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
import { Button } from "components/ui/button";
import { useDataCache } from "context/DataCacheContext";

type TabType = "explore" | "connections";

const SocialPost = ({ user }: { user: IUser }) => {
  const { getCachedData, setCachedData, isCacheValid } = useDataCache();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMorePost, setLoadingMorePost] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("explore");

  const [currentVideoPlaying, setCurrentVideoPlaying] = useState<string>("");
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const [postForReplyModal, setPostForReplyModal] = useState<IPost | null>(
    null,
  );
  const [replyToReply, setReplyToReply] = useState<IPostComment | null>(null);
  const [newReply, setNewReply] = useState<IPostComment | null>(null);

  const [replies, setReplies] = useState<IPostComment[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState<boolean>(false);

  const scrollRef = useRef(0);

  // Restore scroll position when returning from post details
  useEffect(() => {
    const saved = sessionStorage.getItem("social-scroll-pos");
    if (saved) {
      const scrollContainer = document.getElementById("social-main-scroll");
      if (scrollContainer) {
        // Use requestAnimationFrame to wait for the DOM to be ready
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = Number(saved);
          sessionStorage.removeItem("social-scroll-pos");
        });
      }
    }
  }, []);

  // Check cache on mount
  useEffect(() => {
    const cacheKey = `social-posts-${activeTab}`;
    const cachedPosts = getCachedData<IPost[]>(cacheKey);

    if (cachedPosts && isCacheValid(cacheKey, 5)) {
      // Use cached data if it's less than 5 minutes old
      setPosts(cachedPosts);
      setIsPostLoading(false);

      // Also restore page count so infinite scroll continues from right page
      const cachedPage = getCachedData<number>(`social-page-${activeTab}`);
      if (cachedPage) {
        setPage(cachedPage);
      }
    } else {
      // Fetch fresh data if cache is invalid or doesn't exist
      fetchPosts(1, activeTab);
    }
  }, [activeTab]);

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
          : post,
      ),
    );

    try {
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
              : post,
          ),
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
            : post,
        ),
      );
      console.error("Error liking post:", error);
    }
  }, []);

  const saveUnsavePost = useCallback(async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/save`, { method: "POST" });
      const result = await res.json();

      if (result?.status) {
        setPosts((prev) =>
          prev.map((post) =>
            post.uuid === postId
              ? { ...post, is_saved: !post?.is_saved }
              : post,
          ),
        );
      } else {
        toast.error(result?.message || "Failed to save post");
      }
    } catch (e) {
      console.error("Error saving post", e);
      toast.error("Failed to save post");
    }
  }, []);

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
          // Cache the first page of posts
          const cacheKey = `social-posts-${tab}`;
          setCachedData(cacheKey, newPosts);
        } else {
          setPosts((prev) => {
            const updated = [...prev, ...newPosts];
            // Cache ALL loaded posts so scroll restoration works
            const cacheKey = `social-posts-${tab}`;
            setCachedData(cacheKey, updated);
            return updated;
          });
        }
        // Cache current page number
        setCachedData(`social-page-${tab}`, pageNumber);

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
    // Only fetch if we don't have cached data or if we're loading more pages
    if (page > 1) {
      fetchPosts(page, activeTab);
    }
  }, [page]);

  // Scroll Restoration
  const { getScrollPosition, setScrollPosition } = useDataCache();
  const hasRestoredScrollRef = useRef(false);

  // Continuously save scroll position via scroll listener
  useEffect(() => {
    const scrollContainer = document.getElementById("social-main-scroll");
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrollPosition(`social-scroll-${activeTab}`, scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab, setScrollPosition]);

  // Reset on unmount so restore fires again next time we come back
  useEffect(() => {
    return () => {
      hasRestoredScrollRef.current = false;
    };
  }, []);

  // Restore scroll when posts are loaded from cache
  useEffect(() => {
    if (!isPostLoading && posts.length > 0 && !hasRestoredScrollRef.current) {
      hasRestoredScrollRef.current = true;
      const savedPos = getScrollPosition(`social-scroll-${activeTab}`);
      if (savedPos > 0) {
        // Double rAF ensures the list has fully painted before scrolling
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const scrollContainer = document.getElementById("social-main-scroll");
            if (scrollContainer) {
              scrollContainer.scrollTop = savedPos;
            }
          });
        });
      }
    }
  }, [isPostLoading, posts.length, activeTab, getScrollPosition]);

  useEffect(() => {
    hasRestoredScrollRef.current = false; // Reset when tab changes
  }, [activeTab]);

  const observerTarget = useRef(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
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
      },
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
  }, [hasMore, isPostLoading, loadingMorePost]);

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
      { threshold: thresholds },
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
    // Navigate via router instead of state (handled in EachSocialPost/RightSidebar)
    // Legacy state logic removed
  };

  useEffect(() => {
    // Custom event listener removed as we navigate to standalone page
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchPosts(1, activeTab);
    };

    window.addEventListener("refreshSocialPosts", handleRefresh);
    return () => {
      window.removeEventListener("refreshSocialPosts", handleRefresh);
    };
  }, [activeTab]);

  const handleBack = () => {
    // Navigation back handled by browser history
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
          : p,
      ),
    );
    setNewReply(newReply); // Pass to PostDetails
    handleCloseReplyModal();
  };

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
    setPosts([]);
    setHasMore(true);
  }, []);

  return (
    <>
      {/* <ProgressBar progress={50} /> */}
      <div className="flex flex-col gap-y-2 w-full">
        {/* Header with tabs - Responsive */}
        <div className="flex justify-between items-center z-40 sticky -top-4 py-3 bg-background">
          <div className="flex bg-transparent gap-x-3 w-fit">
            {/* Explore Button */}
            <button
              onClick={() => handleTabChange("explore")}
              className={`px-8 py-2 text-sm font-normal rounded-xl border transition-all duration-300 ${activeTab === "explore"
                ? "border-[#31373f] dark:border-transparent bg-[#31373f] text-white dark:bg-foreground dark:text-background"
                : "border-gray-200 dark:border-border bg-transparent text-muted-foreground hover:text-[#31373f] dark:hover:text-[#31373f]"
                }`}
            >
              Explore
            </button>

            {/* Connections Button */}
            <button
              onClick={() => handleTabChange("connections")}
              className={`px-8 py-2 text-sm font-normal rounded-xl border transition-all duration-300 ${activeTab === "connections"
                ? "border-[#31373f] dark:border-transparent bg-[#31373f] text-white dark:bg-foreground dark:text-background"
                : "border-gray-200 dark:border-border bg-transparent text-muted-foreground hover:text-[#31373f] dark:hover:text-[#31373f]"
                }`}
            >
              Connections
            </button>
          </div>
        </div>

        {/* Top divider line pulled fully to the edges over the main column padding */}
        <Separator className="hidden md:block opacity-40 -ml-4 lg:-ml-6 w-[calc(100%+32px)] lg:w-[calc(100%+48px)] max-w-none mb-0" />

        {isPostLoading && (
          <div className="flex flex-col gap-y-0 md:gap-y-4 py-0 md:py-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        )}

        {!isPostLoading && posts?.length > 0 && (
          <div className="flex flex-col gap-y-0 md:gap-y-4 py-0 md:py-4">
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
      {isReplyModalOpen && postForReplyModal && (
        <ReplyToPostModal
          open={isReplyModalOpen}
          onClose={handleCloseReplyModal}
          post={postForReplyModal}
          user={user}
          setPosts={setPosts}
          replyToComment={replyToReply}
          onReplySuccess={handleReplySuccess}
          isInPostDetails={false}
        />
      )}
    </>
  );
};

export default SocialPost;
