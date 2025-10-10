"use client";

import { getPosts, likeOrUnlikePost, saveOrUnsavePost } from "app/api/post";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import NotFoundResult from "../Reusable/NotFoundResult";
import EachSocialPost from "./EachSocialPost";
import SocialPostFilterDialog from "./SocialPostFilterDialog";
import AddPost from "./AddPost";
import PostDetails from "./PostDetails";
import ReplyToPostModal from "./ReplyToPostModal";

const SocialPost = ({ user }: { user: IUser }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMorePost, setLoadingMorePost] = useState<boolean>(false);

  const [currentVideoPlaying, setCurrentVideoPlaying] = useState<string>("");
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const [postForReplyModal, setPostForReplyModal] = useState<IPost | null>(
    null
  );
  const [replyToReply, setReplyToReply] = useState<IPostComment | null>(null);

  const scrollRef = useRef(0);

  // const likeUnlikePost = async (postId: string) => {
  //   const formData = new FormData();
  //   const result = await likeOrUnlikePost(postId, formData);
  //   if (result?.status) {
  //     setPosts((prev) =>
  //       prev.map((post) =>
  //         post.uuid === postId
  //           ? {
  //               ...post,
  //               likes_count: result?.data?.is_liked
  //                 ? (Number(post.likes_count) + 1).toString()
  //                 : (Number(post.likes_count) - 1).toString(),
  //               is_liked: !post.is_liked,
  //             }
  //           : post
  //       )
  //     );
  //   } else {
  //     toast.error(result?.message);
  //   }
  // };

  const likeUnlikePost = useCallback(async (postId: string) => {
    // Optimistically update the UI
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
      // Make API call
      const formData = new FormData();
      const result = await likeOrUnlikePost(postId, formData);

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
      // Revert optimistic update on error
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
    const formData = new FormData();
    const result = await saveOrUnsavePost(postId, formData);
    if (result?.status) {
      setPosts((prev) =>
        prev.map((post) =>
          post.uuid === postId ? { ...post, is_saved: !post?.is_saved } : post
        )
      );
    } else {
      toast.error(result?.message);
    }
  };

  const fetchPosts = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        setIsPostLoading(true);
      } else {
        setLoadingMorePost(true);
      }

      const response = await getPosts({
        order: "latest",
        location: "lagos",
        include: "livestream,echo,post",
        page: pageNumber,
      });

      const newPosts = response?.data;

      if (Array.isArray(newPosts)) {
        if (pageNumber === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        const totalPosts = response?.total || 0;
        const currentTotal =
          (pageNumber - 1) * (response?.per_page || 10) + newPosts.length;
        setHasMore(currentTotal < totalPosts);
      } else {
        toast.error("Failed to load posts");
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
    fetchPosts(page);
  }, [page]);

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
      // if (currentTarget) observer.unobserve(currentTarget);
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
          ? { ...p, replies_count: (Number(p.replies_count) + 1).toString() }
          : p
      )
    );
    handleCloseReplyModal();
  };

  // const handleReplyCountUpdate = (postId: string) => {
  //   // Optimistically update the replies count in the main posts list
  //   setPosts((prev) =>
  //     prev.map((p) =>
  //       p.uuid === postId
  //         ? { ...p, replies_count: (Number(p.replies_count) + 1).toString() }
  //         : p
  //     )
  //   );
  // };

  return (
    <>
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
          // onReplySuccess={handleReplySuccess}
        />
      ) : (
        <>
          <AddPost user={user} onRefreshPosts={() => fetchPosts(1)} />

          <div className="flex flex-col gap-y-4">
            <div className="border-b-[1.5px] flex justify-between">
              <div className="flex flex-row">
                <span className="py-3 px-5 text-lg border-b-4 border-primary">
                  Explore
                </span>
                <span className="py-3 px-5 text-lg">Connection</span>
              </div>
              <SocialPostFilterDialog />
            </div>

            {isPostLoading && <LoadingSpinner />}

            {!isPostLoading && posts?.length > 0 && (
              <div className="border rounded-xl flex flex-col gap-y-4 py-4">
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
        />
      )}
    </>
  );
};

export default SocialPost;

// "use client";

// import { getPosts, likeOrUnlikePost, saveOrUnsavePost } from "app/api/post";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { toast } from "sonner";
// import LoadingSpinner from "../Reusable/LoadingSpinner";
// import NotFoundResult from "../Reusable/NotFoundResult";
// import EachSocialPost from "./EachSocialPost";
// import SocialPostFilterDialog from "./SocialPostFilterDialog";
// import AddPost from "./AddPost";
// import PostDetails from "./PostDetails";
// import ReplyModal from "./ReplyToPostModal";

// const SocialPost = ({ user }: { user: IUser }) => {
//   const [posts, setPosts] = useState<IPost[]>([]);
//   const [isPostLoading, setIsPostLoading] = useState<boolean>(true);
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [loadingMorePost, setLoadingMorePost] = useState<boolean>(false);

//   // Single source-of-truth for playback
//   const [currentVideoPlaying, setCurrentVideoPlaying] = useState<string>("");
//   const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

//   const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
//   const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
//   const scrollRef = useRef(0);

//   const likeUnlikePost = async (postId: string) => {
//     const formData = new FormData();
//     const result = await likeOrUnlikePost(postId, formData);
//     if (result?.status) {
//       setPosts((prev) =>
//         prev.map((post) =>
//           post.uuid === postId
//             ? {
//                 ...post,
//                 likes_count: result?.data?.is_liked
//                   ? (Number(post.likes_count) + 1).toString()
//                   : (Number(post.likes_count) - 1).toString(),
//                 is_liked: !post.is_liked,
//               }
//             : post
//         )
//       );
//     } else {
//       toast.error(result?.message);
//     }
//   };

//   const saveUnsavePost = async (postId: string) => {
//     const formData = new FormData();
//     const result = await saveOrUnsavePost(postId, formData);
//     if (result?.status) {
//       setPosts((prev) =>
//         prev.map((post) =>
//           post.uuid === postId ? { ...post, is_saved: !post?.is_saved } : post
//         )
//       );
//     } else {
//       toast.error(result?.message);
//     }
//   };

//   const fetchPosts = async (pageNumber: number) => {
//     try {
//       if (pageNumber === 1) {
//         setIsPostLoading(true);
//       } else {
//         setLoadingMorePost(true);
//       }

//       const response = await getPosts({
//         order: "latest",
//         location: "lagos",
//         include: "livestream,echo,post",
//         page: pageNumber,
//       });

//       const newPosts = response?.data;

//       if (Array.isArray(newPosts)) {
//         if (pageNumber === 1) {
//           setPosts(newPosts);
//         } else {
//           setPosts((prev) => [...prev, ...newPosts]);
//         }

//         const totalPosts = response?.total || 0;
//         const currentTotal =
//           (pageNumber - 1) * (response?.per_page || 10) + newPosts.length;
//         setHasMore(currentTotal < totalPosts);
//       } else {
//         toast.error("Failed to load posts");
//       }
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       toast.error("An error occurred while fetching posts");
//     } finally {
//       setIsPostLoading(false);
//       setLoadingMorePost(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts(page);
//   }, [page]);

//   /* INFINITE SCROLL OBSERVER */
//   const observerTarget = useRef(null);
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (
//           entries[0].isIntersecting &&
//           hasMore &&
//           !isPostLoading &&
//           !loadingMorePost
//         ) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       },
//       {
//         root: null,
//         rootMargin: "100px",
//         threshold: 0.1,
//       }
//     );

//     const currentTarget = observerTarget.current;
//     if (currentTarget) {
//       observer.observe(currentTarget);
//     }
//     return () => {
//       if (currentTarget) observer.unobserve(currentTarget);
//     };
//   }, [hasMore, isPostLoading, loadingMorePost]);

//   const videoElementsRef = useRef<Map<string, HTMLElement>>(new Map());
//   const visibilityMapRef = useRef<Map<string, number>>(new Map());
//   const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

//   // Create the observer once
//   useEffect(() => {
//     // threshold array gives a granular intersectionRatio
//     const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
//     intersectionObserverRef.current = new IntersectionObserver(
//       (entries) => {
//         // update visible ratios
//         entries.forEach((entry) => {
//           const id = entry.target.getAttribute("data-media-id");
//           if (!id) return;
//           visibilityMapRef.current.set(id, entry.intersectionRatio);
//         });

//         // find the registered media id with the highest intersectionRatio
//         let bestId = "";
//         let bestRatio = 0;
//         for (const [id] of videoElementsRef.current.entries()) {
//           const ratio = visibilityMapRef.current.get(id) ?? 0;
//           if (ratio > bestRatio) {
//             bestRatio = ratio;
//             bestId = id;
//           }
//         }

//         // require a reasonable visibility to auto-play (60% here)
//         if (bestRatio >= 0.6) {
//           if (bestId !== currentVideoPlaying) {
//             setCurrentVideoPlaying(bestId);
//             setIsPlayingVideo(true);
//           }
//         } else {
//           // no strong candidate -> pause playback
//           if (currentVideoPlaying) {
//             setCurrentVideoPlaying("");
//             setIsPlayingVideo(false);
//           }
//         }
//       },
//       { threshold: thresholds }
//     );

//     return () => {
//       intersectionObserverRef.current?.disconnect();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // run once

//   // Register / unregister video container elements from children
//   const registerVideoRef = useCallback((id: string, el: HTMLElement | null) => {
//     const observer = intersectionObserverRef.current;
//     if (el) {
//       // Attach data attribute for lookup
//       el.setAttribute("data-media-id", id);
//       videoElementsRef.current.set(id, el);
//       visibilityMapRef.current.set(id, 0);
//       if (observer) observer.observe(el);
//     } else {
//       // unmounting: unobserve and clear state
//       const prev = videoElementsRef.current.get(id);
//       if (prev && observer) observer.unobserve(prev);
//       videoElementsRef.current.delete(id);
//       visibilityMapRef.current.delete(id);
//     }
//   }, []);

//   /* ---------- Open details helper ---------- */
//   const handleOpenPost = (post: IPost) => {
//     // pause feed playback before opening details
//     setIsPlayingVideo(false);
//     setCurrentVideoPlaying("");
//     scrollRef.current = window.scrollY;
//     setSelectedPost(post);
//   };

//   const handleBack = () => {
//     setSelectedPost(null);
//     // restore scroll
//     setTimeout(() => {
//       window.scrollTo(0, scrollRef.current);
//     }, 0);
//   };

//    const handleOpenReplyModal = (post: IPost) => {
//     setIsPlayingVideo(false);
//     setCurrentVideoPlaying("");
//     // scrollRef.current = window.scrollY;
//     setSelectedPost(post);
//     setIsReplyModalOpen(true);
//   };

//   const handleCloseReplyModal = () => {
//     setIsReplyModalOpen(false);
//     setSelectedPost(null);
//   }

//   return (
//     <>
//       {selectedPost ? (
//         <PostDetails
//           post={selectedPost}
//           user={user}
//           setPosts={setPosts}
//           onBack={handleBack}
//           likeUnlikePost={likeUnlikePost}
//           saveUnsavePost={saveUnsavePost}
//           currentVideoPlaying={currentVideoPlaying}
//           setCurrentVideoPlaying={setCurrentVideoPlaying}
//           isPlayingVideo={isPlayingVideo}
//           setIsPlayingVideo={setIsPlayingVideo}
//           isReplyModalOpen={isReplyModalOpen}
//           setIsReplyModalOpen={setIsReplyModalOpen}
//         />
//       ) : (
//         <>
//           <AddPost
//             user={user}
//             // addPost={(newPost: IPost) => setPosts((prev) => [newPost, ...prev])}
//             onRefreshPosts={() => fetchPosts(1)}
//           />

//           <div className="flex flex-col gap-y-4">
//             <div className="border-b-[1.5px] flex justify-between">
//               <div className="flex flex-row">
//                 <span className="py-3 px-5 text-lg border-b-4 border-primary">
//                   Explore
//                 </span>
//                 <span className="py-3 px-5 text-lg">Connection</span>
//               </div>
//               <SocialPostFilterDialog />
//             </div>

//             {isPostLoading && <LoadingSpinner />}

//             {!isPostLoading && posts?.length > 0 && (
//               <div className="border rounded-xl flex flex-col gap-y-4 py-4">
//                 {posts.map((post) => (
//                   <EachSocialPost
//                     key={post.uuid}
//                     user={user}
//                     setPosts={setPosts}
//                     likeUnlikePost={likeUnlikePost}
//                     saveUnsavePost={saveUnsavePost}
//                     post={post}
//                     currentVideoPlaying={currentVideoPlaying}
//                     setCurrentVideoPlaying={setCurrentVideoPlaying}
//                     isPlayingVideo={isPlayingVideo}
//                     setIsPlayingVideo={setIsPlayingVideo}
//                     onOpenPostDetails={() => handleOpenPost(post)}
//                     onOpenReplyModal={() => handleOpenReplyModal(post)}
//                   />
//                 ))}

//                 <div ref={observerTarget} style={{ height: "10px" }} />
//                 {loadingMorePost && (
//                   <div className="py-4 text-center">
//                     <LoadingSpinner />
//                   </div>
//                 )}
//               </div>
//             )}

//             {!isPostLoading && posts?.length === 0 && (
//               <NotFoundResult
//                 content={<span>No posts available at the moment.</span>}
//               />
//             )}

//             {!isPostLoading && !hasMore && posts?.length > 0 && (
//               <div className="text-center py-4 text-muted-foreground">
//                 No more posts to load
//               </div>
//             )}
//           </div>
//         </>
//       )}
//       {isReplyModalOpen && selectedPost && (
//         <ReplyModal
//           post={selectedPost}
//           user={user}
//           open={isReplyModalOpen}
//           onClose={handleCloseReplyModal}
//           setPosts={setPosts}
//           // Pass other necessary props to the modal as needed
//         />
//       )}
//     </>
//   );
// };

// export default SocialPost;

// "use client";

// import { getPosts, likeOrUnlikePost, saveOrUnsavePost } from "app/api/post";
// import { useEffect, useRef, useState } from "react";
// import { toast } from "sonner";
// import LoadingSpinner from "../Reusable/LoadingSpinner";
// import NotFoundResult from "../Reusable/NotFoundResult";
// import EachSocialPost from "./EachSocialPost";
// import SocialPostFilterDialog from "./SocialPostFilterDialog";
// import AddPost from "./AddPost";
// import PostDetails from "./PostDetails";

// const SocialPost = ({ user }: { user: IUser }) => {
//   const [posts, setPosts] = useState<IPost[]>([]);
//   const [isPostLoading, setIsPostLoading] = useState<boolean>(true);
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [loadingMorePost, setLoadingMorePost] = useState<boolean>(false);
//   const [currentVideoPlaying, setCurrentVideoPlaying] = useState<string>("");
//   const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
//   const [isExplore, setIsExplore] = useState<boolean>(true);
//   const [isConnection, setIsConnection] = useState<boolean>(false);
//   const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

//     const scrollRef = useRef(0);

//   const likeUnlikePost = async (postId: string) => {
//     const formData = new FormData();
//     const result = await likeOrUnlikePost(postId, formData);
//     if (result?.status) {
//       setPosts((prev) =>
//         prev.map((post) =>
//           post.uuid === postId
//             ? {
//                 ...post,
//                 likes_count: result?.data?.is_liked
//                   ? (Number(post.likes_count) + 1).toString()
//                   : (Number(post.likes_count) - 1).toString(),
//                 is_liked: !post.is_liked,
//               }
//             : post
//         )
//       );
//     } else {
//       toast.error(result?.message);
//     }
//   };

//   const saveUnsavePost = async (postId: string) => {
//     const formData = new FormData();
//     const result = await saveOrUnsavePost(postId, formData);
//     if (result?.status) {
//       setPosts((prev) =>
//         prev.map((post) =>
//           post.uuid === postId
//             ? {
//                 ...post,
//                 is_saved: !post?.is_saved,
//               }
//             : post
//         )
//       );
//     } else {
//       toast.error(result?.message);
//     }
//   };

//   const fetchPosts = async (pageNumber: number) => {
//     try {
//       if (pageNumber === 1) {
//         setIsPostLoading(true);
//       } else {
//         setLoadingMorePost(true);
//       }

//       const response = await getPosts({
//         order: "latest",
//         location: "lagos",
//         include: "livestream,echo,post",
//         page: pageNumber,
//       });

//       console.log("Response:", response);

//       const newPosts = response?.data;
//       console.log(newPosts);
//       if (Array.isArray(newPosts)) {
//         if (pageNumber === 1) {
//           setPosts(newPosts);
//         } else {
//           setPosts((prev) => [...prev, ...newPosts]);
//         }

//         // Check if we have more posts to load
//         const totalPosts = response?.total || 0;
//         const currentTotal =
//           (pageNumber - 1) * (response?.per_page || 10) + newPosts.length;
//         setHasMore(currentTotal < totalPosts);
//       } else {
//         toast.error("Failed to load posts");
//       }
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       toast.error("An error occurred while fetching posts");
//     } finally {
//       setIsPostLoading(false);
//       setLoadingMorePost(false);
//     }
//   };

//   // Intersection Observer setup
//   const observerTarget = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (
//           entries[0].isIntersecting &&
//           hasMore &&
//           !isPostLoading &&
//           !loadingMorePost
//         ) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       },
//       {
//         root: null,
//         rootMargin: "100px",
//         threshold: 0.1,
//       }
//     );

//     const currentTarget = observerTarget.current;
//     if (currentTarget) {
//       observer.observe(currentTarget);
//     }

//     return () => {
//       if (currentTarget) {
//         observer.unobserve(currentTarget);
//       }
//     };
//   }, [hasMore, isPostLoading, loadingMorePost]);

//   useEffect(() => {
//     fetchPosts(page);
//   }, [page]);

//   console.log("POSTS", posts);

//   const handleOpenPost = (post: IPost) => {
//     scrollRef.current = window.scrollY; // save current scroll
//     setSelectedPost(post);
//   };

//   const handleBack = () => {
//     setSelectedPost(null);
//     setTimeout(() => {
//       window.scrollTo(0, scrollRef.current); // restore scroll
//     }, 0);
//   };

//   return (
//     <>
//       {selectedPost ? (
//         <PostDetails
//           post={selectedPost}
//           user={user}
//           setPosts={setPosts}
//           // onBack={() => setSelectedPost(null)} // back button clears selected
//           onBack={handleBack} // updated back button handler
//           likeUnlikePost={likeUnlikePost}
//           saveUnsavePost={saveUnsavePost}
//           currentVideoPlaying={currentVideoPlaying}
//           setCurrentVideoPlaying={setCurrentVideoPlaying}
//           isPlayingVideo={isPlayingVideo}
//           setIsPlayingVideo={setIsPlayingVideo}
//         />
//       ) : (
//         <>
//           <AddPost
//             user={user}
//             addPost={(newPost: IPost) => setPosts((prev) => [newPost, ...prev])}
//             onRefreshPosts={() => fetchPosts(1)}
//           />

//           <div className="flex flex-col gap-y-4">
//             <div className="border-b-[1.5px] flex justify-between">
//               <div className="flex flex-row">
//                 <span className="py-3 px-5 text-lg border-b-4 border-primary">
//                   Explore
//                 </span>
//                 <span className="py-3 px-5 text-lg">Connection</span>
//               </div>
//               <SocialPostFilterDialog />
//             </div>

//             {isPostLoading && <LoadingSpinner />}

//             {!isPostLoading && posts?.length > 0 && (
//               <div className="border rounded-xl flex flex-col gap-y-4 py-4">
//                 {posts.map((post) => (
//                   <EachSocialPost
//                     key={post.uuid}
//                     user={user}
//                     setPosts={setPosts}
//                     likeUnlikePost={likeUnlikePost}
//                     saveUnsavePost={saveUnsavePost}
//                     post={post}
//                     currentVideoPlaying={currentVideoPlaying}
//                     setCurrentVideoPlaying={setCurrentVideoPlaying}
//                     isPlayingVideo={isPlayingVideo}
//                     setIsPlayingVideo={setIsPlayingVideo}
//                     // onOpenPostDetails={() => setSelectedPost(post)} // 👈 hook here
//                     onOpenPostDetails={() => handleOpenPost(post)} // updated handler
//                   />
//                 ))}

//                 <div ref={observerTarget} style={{ height: "10px" }} />
//                 {loadingMorePost && (
//                   <div className="py-4 text-center">
//                     <LoadingSpinner />
//                   </div>
//                 )}
//               </div>
//             )}

//             {!isPostLoading && posts?.length === 0 && (
//               <NotFoundResult
//                 content={<span>No posts available at the moment.</span>}
//               />
//             )}

//             {!isPostLoading && !hasMore && posts?.length > 0 && (
//               <div className="text-center py-4 text-muted-foreground">
//                 No more posts to load
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default SocialPost;
