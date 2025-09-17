"use client";

import { ArrowLeft } from "lucide-react";
import usePost from "src/hooks/usePost";
import SocialPostDetails from "./SocialPostDetails";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { useCallback, useEffect, useState } from "react";
import { getPostComments, likeOrUnlikePost, saveOrUnsavePost } from "api/post";
import Image from "next/image";
import PostVideo from "./PostVideo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "components/ui/carousel";
import SocialPostActionButtons from "./SocialPostActionButtons";
import ReplyPostActionButtons from "./ReplyPostActionButtons";
import ReplyModal from "./ReplyToPostModal";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import NotFoundResult from "../Reusable/NotFoundResult";
interface PostDetailsProps {
  post: IPost;
  user: IUser;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  onBack: () => void;
  likeUnlikePost: (postId: string) => void;
  saveOrUnsavePost: (postId: string) => void;
  currentVideoPlaying: string;
  setCurrentVideoPlaying: (mediaID: string) => void;
  isPlayingVideo: boolean;
  setIsPlayingVideo: (playing: boolean) => void;
  initialMediaIndex?: number;
  onOpenReplyModal: (post: IPost) => void;
  // isReplyModalOpen: boolean;
  // setIsReplyModalOpen: (open: boolean) => void;
}

const PostDetails = ({
  post,
  user,
  setPosts,
  onBack,
  currentVideoPlaying,
  setCurrentVideoPlaying,
  isPlayingVideo,
  setIsPlayingVideo,
  onOpenReplyModal,
}: PostDetailsProps) => {
  const {
    replyingTo,
    setReplyingTo,
    newComment,
    setNewComment,
    postCommentLoading,
    setCommentsWithReplies,
    comments,
    setComments,
    commentsWithReplies,
    handleEmojiClick,
    toggleReplies,
    loadMoreReplies,
    observerTarget,
    initialFetchDone,
  } = usePost(post, setPosts);

  const [replies, setReplies] = useState<IPostComment[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeReplyCarouselIndex, setActiveReplyCarouselIndex] = useState(0);

  const refetchReplies = useCallback(async () => {
    setIsLoadingReplies(true);
    try {
      const response = await getPostComments(post.uuid, 1);
      if (response?.status && response.data) {
        setReplies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setIsLoadingReplies(false);
    }
  }, [post.uuid]);

  const handleReplySuccess = () => {
    refetchReplies(); // Refetch all replies
  };

  useEffect(() => {
    const mainPostMedia = post?.media?.[0];
    if (mainPostMedia && mainPostMedia.media_type === "video") {
      setCurrentVideoPlaying(mainPostMedia.uuid);
      setIsPlayingVideo(true);
    }
  }, [post.uuid, setCurrentVideoPlaying, setIsPlayingVideo]);

  useEffect(() => {
    const handleFetchReplies = async (page: number) => {
      setIsLoadingReplies(true);
      try {
        const response = await getPostComments(post.uuid, page);
        if (response?.status && response.data) {
          setReplies(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching replies:", error);
      } finally {
        setIsLoadingReplies(false);
      }
    };
    handleFetchReplies(1);
  }, [post.uuid]);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-6 px-4 py-2 border-b border-gray-800">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-lg font-semibold text-center">Post Details</h2>
      </div>

      {/* Main Post (Fixed) */}
      <div className="p-4 border-b border-gray-800">
        <SocialPostDetails
          post={post}
          setPosts={setPosts}
          user={user}
          likeUnlikePost={likeOrUnlikePost}
          saveUnsavePost={saveOrUnsavePost}
          currentVideoPlaying={currentVideoPlaying}
          setCurrentVideoPlaying={setCurrentVideoPlaying}
          isPlayingVideo={isPlayingVideo}
          setIsPlayingVideo={setIsPlayingVideo}
        />
      </div>

      {/* Reply box */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
        <CustomAvatar
          src={post?.user?.profile_picture || ""}
          name={post?.user?.name || ""}
          className="size-8 border-foreground border-[1.5px]"
        />
        <div className="flex-1">
          <button
            onClick={() => onOpenReplyModal(post)}
            className="w-full text-left text-sm italic text-gray-400 bg-gray-900 rounded-full px-4 py-2"
          >
            Reply to post
          </button>
        </div>
      </div>

      {/* Comments */}
      {isLoadingReplies ? (
        <LoadingSpinner />
      ) : replies.length > 0 ? (
        <div className="flex flex-col divide-y divide-gray-800">
          {replies.map((reply) => {
            return (
              <div key={reply.uuid} className="flex gap-3 p-4">
                <CustomAvatar
                  src={reply.user?.profile_picture || ""}
                  name={reply.user?.name || ""}
                  className="size-8 border-foreground border-[1.5px]"
                />
                <div className="flex-1">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">
                        {reply.user?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        · {reply.formatted_time}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 my-1">
                      @{reply.user?.username}
                    </div>
                  </div>

                  <p className="text-sm text-gray-200 mt-4">{reply.caption}</p>

                  {reply.media?.length > 0 && (
                    <div className="mt-2">
                      <Carousel
                        onSelect={(api) => {
                          const carouselApi = api as any;

                          if (
                            carouselApi &&
                            typeof carouselApi.selectedScrollSnap === "function"
                          ) {
                            const newIndex = carouselApi.selectedScrollSnap();
                            setActiveReplyCarouselIndex(newIndex);
                            const newMedia = reply.media[newIndex];

                            if (newMedia.media_type === "video") {
                              setCurrentVideoPlaying(newMedia.uuid);
                              setIsPlayingVideo(true);
                            } else {
                              setCurrentVideoPlaying("");
                              setIsPlayingVideo(false);
                            }
                          }
                        }}
                      >
                        <CarouselContent>
                          {reply.media.map((media, index) => (
                            <CarouselItem key={index}>
                              {media.media_type === "image" ? (
                                <Image
                                  src={media.media_url}
                                  alt="reply media"
                                  width={500}
                                  height={500}
                                  className="rounded-xl object-contain"
                                />
                              ) : (
                                <PostVideo
                                  media={media}
                                  src={media.media_url}
                                  currentVideoPlaying={currentVideoPlaying}
                                  setCurrentVideoPlaying={
                                    setCurrentVideoPlaying
                                  }
                                  isPlayingVideo={
                                    activeReplyCarouselIndex === index &&
                                    isPlayingVideo
                                  }
                                  setIsPlayingVideo={setIsPlayingVideo}
                                  isGloballyMuted={isMuted}
                                  setGlobalMuteState={setIsMuted}
                                  className="rounded-xl aspect-[4/5] max-h-[400px]"
                                />
                              )}
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                  )}

                  <ReplyPostActionButtons
                    setPosts={setPosts}
                    likeUnlikePost={likeOrUnlikePost}
                    saveUnsavePost={saveOrUnsavePost}
                    reply={reply}
                    onOpenReplyModal={() => onOpenReplyModal(post)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <NotFoundResult content={<span>No Replies Yet.</span>} />
      )}
      {/* {replies.length > 0 ? (
        <div className="flex flex-col divide-y divide-gray-800">
          {replies.map((reply) => {
            return (
              <div key={reply.uuid} className="flex gap-3 p-4">
                <CustomAvatar
                  src={reply.user?.profile_picture || ""}
                  name={reply.user?.name || ""}
                  className="size-8 border-foreground border-[1.5px]"
                />
                <div className="flex-1">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">
                        {reply.user?.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        · {reply.formatted_time}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 my-1">
                      @{reply.user?.username}
                    </div>
                  </div>

                  <p className="text-sm text-gray-200 mt-4">{reply.caption}</p>

                  {reply.media?.length > 0 && (
                    <div className="mt-2">
                      <Carousel
                        onSelect={(api) => {
                          const carouselApi = api as any;

                          if (
                            carouselApi &&
                            typeof carouselApi.selectedScrollSnap === "function"
                          ) {
                            const newIndex = carouselApi.selectedScrollSnap();
                            setActiveReplyCarouselIndex(newIndex);
                            const newMedia = reply.media[newIndex];

                            if (newMedia.media_type === "video") {
                              setCurrentVideoPlaying(newMedia.uuid);
                              setIsPlayingVideo(true);
                            } else {
                              setCurrentVideoPlaying("");
                              setIsPlayingVideo(false);
                            }
                          }
                        }}
                      >
                        <CarouselContent>
                          {reply.media.map((media, index) => (
                            <CarouselItem key={index}>
                              {media.media_type === "image" ? (
                                <Image
                                  src={media.media_url}
                                  alt="reply media"
                                  width={500}
                                  height={500}
                                  className="rounded-xl object-contain"
                                />
                              ) : (
                                <PostVideo
                                  media={media}
                                  src={media.media_url}
                                  currentVideoPlaying={currentVideoPlaying}
                                  setCurrentVideoPlaying={
                                    setCurrentVideoPlaying
                                  }
                                  isPlayingVideo={
                                    activeReplyCarouselIndex === index &&
                                    isPlayingVideo
                                  }
                                  setIsPlayingVideo={setIsPlayingVideo}
                                  isGloballyMuted={isMuted}
                                  setGlobalMuteState={setIsMuted}
                                  className="rounded-xl aspect-[4/5] max-h-[400px]"
                                />
                              )}
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                  )}

                  <ReplyPostActionButtons
                    setPosts={setPosts}
                    likeUnlikePost={likeOrUnlikePost}
                    saveUnsavePost={saveOrUnsavePost}
                    reply={reply}
                    onOpenReplyModal={() => onOpenReplyModal(post)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : isLoadingReplies ? (
        <p className="p-4 text-sm text-gray-400">Loading replies...</p>
      ) : (
        initialFetchDone && (
          <p className="p-4 text-sm text-gray-400">No replies yet.</p>
        )
      )} */}
      <div ref={observerTarget} />
    </div>
  );
};

export default PostDetails;

// "use client";

// import { ArrowLeft } from "lucide-react";
// import EachSocialPost from "./EachSocialPost";
// import usePost from "src/hooks/usePost";
// import SocialPostDetails from "./SocialPostDetails";
// import CustomAvatar from "components/ui/custom/custom-avatar";
// import { useCallback, useEffect, useState } from "react";
// import { getPostComments, likeOrUnlikePost, saveOrUnsavePost } from "api/post";
// import Image from "next/image";
// import PostVideo from "./PostVideo";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "components/ui/carousel";
// import SocialPostActionButtons from "./SocialPostActionButtons";
// import ReplyPostActionButtons from "./ReplyPostActionButtons";
// import ReplyToPostModal from "./ReplyToPostModal";
// interface PostDetailsProps {
//   post: IPost;
//   user: IUser;
//   setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
//   onBack: () => void;
//   likeUnlikePost: (postId: string) => void;
//   saveUnsavePost: (postId: string) => void;
//   currentVideoPlaying: string;
//   setCurrentVideoPlaying: (mediaID: string) => void;
//   isPlayingVideo: boolean;
//   setIsPlayingVideo: (playing: boolean) => void;
//   initialMediaIndex?: number;
//   isReplyModalOpen: boolean;
//   setIsReplyModalOpen: (open: boolean) => void;
// }

// const PostDetails = ({
//   post,
//   user,
//   setPosts,
//   onBack,
//   currentVideoPlaying,
//   setCurrentVideoPlaying,
//   isPlayingVideo,
//   setIsPlayingVideo,
//   isReplyModalOpen,
//   setIsReplyModalOpen,
// }: PostDetailsProps) => {
//   const {
//     replyingTo,
//     setReplyingTo,
//     newComment,
//     setNewComment,
//     postCommentLoading,
//     setCommentsWithReplies,
//     comments,
//     setComments,
//     commentsWithReplies,
//     handleEmojiClick,
//     // handleSubmitComment,
//     toggleReplies,
//     loadMoreReplies,
//     observerTarget,
//     initialFetchDone,
//   } = usePost(post, setPosts);

//   const [replies, setReplies] = useState<IPostComment[]>([]);
//   const [isLoadingReplies, setIsLoadingReplies] = useState<boolean>(false);
//   const [isMuted, setIsMuted] = useState(true);

//   // State to track the active item in the replies carousel
//   const [activeReplyCarouselIndex, setActiveReplyCarouselIndex] = useState(0);

//   const refetchReplies = useCallback(async () => {
//     setIsLoadingReplies(true);
//     try {
//       const response = await getPostComments(post.uuid, 1);
//       if (response?.status && response.data) {
//         setReplies(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching replies:", error);
//     } finally {
//       setIsLoadingReplies(false);
//     }
//   }, [post.uuid]);

//   const handlePostReplySuccess = () => {
//     refetchReplies(); // Refetch all replies
//     handleCloseReplyModal(); // Close the modal
//   };

//   useEffect(() => {
//     if (isReplyModalOpen && post) {
//       setReplyingTo(post);
//     }
//   }, [isReplyModalOpen, post, setReplyingTo]);

//    // Function to open the modal and set who we are replying to
//   const handleOpenReplyModal = (replyTo?: IPostComment) => {
//     if (replyTo) {
//       setReplyingTo(replyTo);
//     } else {
//       // If no replyTo is provided, we are replying to the main post
//       setReplyingTo(post);
//     }
//     setIsReplyModalOpen(true);
//   };

//   // Function to close the modal and reset state
//   const handleCloseReplyModal = () => {
//     setIsReplyModalOpen(false);
//     setNewComment("");
//     setReplyingTo(null);
//   };

//   // New function to handle the reply submission from the modal
//   const handlePostReply = () => {
//     // Add your reply submission logic here
//     console.log("Submitting reply:", newComment, "to:", replyingTo?.user?.username);
//     // You would call your API endpoint here
//     handleCloseReplyModal();
//   };

//   useEffect(() => {
//     // Check if the main post has a video
//     const mainPostMedia = post?.media?.[0];
//     if (mainPostMedia && mainPostMedia.media_type === "video") {
//       // If it's a video, set the state to play it immediately
//       setCurrentVideoPlaying(mainPostMedia.uuid);
//       setIsPlayingVideo(true);
//     }
//   }, [post.uuid, setCurrentVideoPlaying, setIsPlayingVideo]);

//   useEffect(() => {
//     const handleFetchReplies = async (page: number) => {
//       setIsLoadingReplies(true);
//       try {
//         const response = await getPostComments(post.uuid, page);
//         if (response?.status && response.data) {
//           setReplies(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching replies:", error);
//       } finally {
//         setIsLoadingReplies(false);
//       }
//     };
//     handleFetchReplies(1);
//   }, [post.uuid]);

//   return (
//     <div className="flex flex-col w-full max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-6 px-4 py-2 border-b border-gray-800">
//         <button
//           onClick={onBack}
//           className="p-2 rounded-full hover:bg-gray-800 transition"
//         >
//           <ArrowLeft className="w-5 h-5 text-white" />
//         </button>
//         <h2 className="text-lg font-semibold text-center">Post Details</h2>
//       </div>

//       {/* Main Post (Fixed) */}
//       <div className="p-4 border-b border-gray-800">
//         <SocialPostDetails
//           post={post}
//           setPosts={setPosts}
//           user={user}
//           likeUnlikePost={likeOrUnlikePost}
//           saveUnsavePost={saveOrUnsavePost}
//           currentVideoPlaying={currentVideoPlaying}
//           setCurrentVideoPlaying={setCurrentVideoPlaying}
//           isPlayingVideo={isPlayingVideo}
//           setIsPlayingVideo={setIsPlayingVideo}
//         />
//       </div>

//       {/* Reply box */}
//       <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
//         <CustomAvatar
//           src={post?.user?.profile_picture || ""}
//           name={post?.user?.name || ""}
//           className="size-8 border-foreground border-[1.5px]"
//         />
//         <div className="flex-1">
//           <button
//             onClick={() => handleOpenReplyModal()}
//             className="w-full text-left text-sm italic text-gray-400 bg-gray-900 rounded-full px-4 py-2"
//           >
//             Reply to post
//           </button>
//         </div>
//       </div>

//       {/* This is the new, cleaned up modal component */}
//       <ReplyToPostModal
//         isOpen={isReplyModalOpen}
//         onClose={handleCloseReplyModal}
//         replyingTo={replyingTo}
//         newComment={newComment}
//         setNewComment={setNewComment}
//         user={user}
//         onPostReply={handlePostReply}
//         onPostReplySuccess={handlePostReplySuccess}
//       />

//       {/* Comments */}
//       {replies.length > 0 ? (
//         <div className="flex flex-col divide-y divide-gray-800">
//           {replies.map((reply) => {
//             return (
//               <div key={reply.uuid} className="flex gap-3 p-4">
//                 <CustomAvatar
//                   src={reply.user?.profile_picture || ""}
//                   name={reply.user?.name || ""}
//                   className="size-8 border-foreground border-[1.5px]"
//                 />
//                 <div className="flex-1">
//                   {/* Header */}
//                   <div className="flex flex-col">
//                     <div className="flex items-center gap-2">
//                       <span className="font-semibold text-sm text-white">
//                         {reply.user?.name}
//                       </span>
//                       <span className="text-xs text-gray-400">
//                         · {reply.formatted_time}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-400 my-1">
//                       @{reply.user?.username}
//                     </div>
//                   </div>

//                   {/* Caption */}
//                   <p className="text-sm text-gray-200 mt-4">{reply.caption}</p>

//                   {/* Media (Fixed with Carousel index) */}
//                   {reply.media?.length > 0 && (
//                     <div className="mt-2">
//                       <Carousel
//                         onSelect={(api) => {
//                           // Cast the api object to 'any' to bypass the TypeScript error
//                           const carouselApi = api as any;

//                           if (
//                             carouselApi &&
//                             typeof carouselApi.selectedScrollSnap === "function"
//                           ) {
//                             const newIndex = carouselApi.selectedScrollSnap();
//                             setActiveReplyCarouselIndex(newIndex);
//                             const newMedia = reply.media[newIndex];

//                             // Update the main video state based on the selected reply video
//                             if (newMedia.media_type === "video") {
//                               setCurrentVideoPlaying(newMedia.uuid);
//                               setIsPlayingVideo(true);
//                             } else {
//                               setCurrentVideoPlaying("");
//                               setIsPlayingVideo(false);
//                             }
//                           }
//                         }}
//                       >
//                         <CarouselContent>
//                           {reply.media.map((media, index) => (
//                             <CarouselItem key={index}>
//                               {media.media_type === "image" ? (
//                                 <Image
//                                   src={media.media_url}
//                                   alt="reply media"
//                                   width={500}
//                                   height={500}
//                                   className="rounded-xl object-contain"
//                                 />
//                               ) : (
//                                 <PostVideo
//                                   media={media}
//                                   src={media.media_url}
//                                   currentVideoPlaying={currentVideoPlaying}
//                                   setCurrentVideoPlaying={
//                                     setCurrentVideoPlaying
//                                   }
//                                   isPlayingVideo={
//                                     activeReplyCarouselIndex === index &&
//                                     isPlayingVideo
//                                   }
//                                   setIsPlayingVideo={setIsPlayingVideo}
//                                   isGloballyMuted={isMuted}
//                                   setGlobalMuteState={setIsMuted}
//                                   // showEchoButtons={false}
//                                   className="rounded-xl aspect-[4/5] max-h-[400px]"
//                                 />
//                               )}
//                             </CarouselItem>
//                           ))}
//                         </CarouselContent>
//                         <CarouselPrevious />
//                         <CarouselNext />
//                       </Carousel>
//                     </div>
//                   )}

//                   <ReplyPostActionButtons
//                     setPosts={setPosts}
//                     likeUnlikePost={likeOrUnlikePost}
//                     saveUnsavePost={saveOrUnsavePost}
//                     reply={reply}
//                     onOpenReplyModal={() => handleOpenReplyModal(reply)}
//                     // onOpenReplyModal={onOpenReplyModal}
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : isLoadingReplies ? (
//         <p className="p-4 text-sm text-gray-400">Loading replies...</p>
//       ) : (
//         initialFetchDone && (
//           <p className="p-4 text-sm text-gray-400">No replies yet.</p>
//         )
//       )}
//       <div ref={observerTarget} />
//     </div>
//   );
// };

// export default PostDetails;

// "use client";

// import { ArrowLeft } from "lucide-react";
// import EachSocialPost from "./EachSocialPost";
// import usePost from "src/hooks/usePost";
// import SocialPostDetails from "./SocialPostDetails";
// import CustomAvatar from "components/ui/custom/custom-avatar";
// import { useEffect, useState } from "react";
// import { getPostComments } from "api/post";
// import Image from "next/image";
// import PostVideo from "./PostVideo";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "components/ui/carousel";
// import SocialPostActionButtons from "./SocialPostActionButtons";
// interface PostDetailsProps {
//   post: IPost;
//   user: IUser;
//   setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
//   onBack: () => void;
//   likeUnlikePost: (postId: string) => void;
//   saveUnsavePost: (postId: string) => void;
//   currentVideoPlaying: string;
//   setCurrentVideoPlaying: (mediaID: string) => void;
//   isPlayingVideo: boolean;
//   setIsPlayingVideo: (playing: boolean) => void;
//   initialMediaIndex?: number;
// }

// const PostDetails = ({
//   post,
//   user,
//   setPosts,
//   onBack,
//   currentVideoPlaying,
//   setCurrentVideoPlaying,
//   isPlayingVideo,
//   setIsPlayingVideo,
// }: PostDetailsProps) => {
//   const {
//     replyingTo,
//     setReplyingTo,
//     newComment,
//     setNewComment,
//     postCommentLoading,
//     setCommentsWithReplies,
//     comments,
//     setComments,
//     commentsWithReplies,
//     handleEmojiClick,
//     // handleSubmitComment,
//     toggleReplies,
//     loadMoreReplies,
//     observerTarget,
//     initialFetchDone,
//   } = usePost(post, setPosts);

//   const [replies, setReplies] = useState<IPostComment[]>([]);
//   const [isLoadingReplies, setIsLoadingReplies] = useState<boolean>(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const handleFetchReplies = async (page: number) => {
//       setIsLoadingReplies(true);
//       try {
//         const response = await getPostComments(post.uuid, page);
//         if (response?.status && response.data) {
//           // console.log("Replies Response from mine: ", response);
//           setReplies(response.data.data);
//           setIsLoadingReplies(false);
//         }
//       } catch (error) {
//         console.error("Error fetching replies:", error);
//       } finally {
//         setIsLoadingReplies(false);
//       }

//       return () => {
//         setIsLoadingReplies(false);
//       };
//     };
//     handleFetchReplies(1);
//   }, []);

//   return (
//     <div className="flex flex-col w-full max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-6 px-4 py-2 border-b border-gray-800">
//         <button
//           onClick={onBack}
//           className="p-2 rounded-full hover:bg-gray-800 transition"
//         >
//           <ArrowLeft className="w-5 h-5 text-white" />
//         </button>
//         <h2 className="text-lg font-semibold text-center">Post Details</h2>
//       </div>

//       {/* Main Post */}
//       <div className="p-4 border-b border-gray-800">
//         <SocialPostDetails
//           post={post}
//           setPosts={setPosts}
//           user={user}
//           likeUnlikePost={() => {}}
//           saveUnsavePost={() => {}}
//           currentVideoPlaying=""
//           setCurrentVideoPlaying={() => {}}
//           isPlayingVideo={false}
//           setIsPlayingVideo={() => {}}
//         />
//       </div>

//       {/* Reply box */}
//       <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
//         <CustomAvatar
//           src={post?.user?.profile_picture || ""}
//           name={post?.user?.name || ""}
//           className="size-8 border-foreground border-[1.5px]"
//         />{" "}
//         <div className="flex-1">
//           <textarea
//             className="w-full bg-transparent italic resize-none border-b border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
//             rows={2}
//             placeholder={
//               replyingTo
//                 ? `Replying to ${replyingTo.user?.username}`
//                 : "Reply to post"
//             }
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Comments */}
//       {/* <div className="flex flex-col divide-y divide-gray-800">
//         {comments.map((comment) => (
//           <div key={comment.uuid} className="p-4">
//             <p className="text-sm">{comment.caption}</p>

//             {commentsWithReplies[comment.uuid]?.loadedReplies?.map((reply) => (
//               <div key={reply.uuid} className="ml-8 mt-2 text-sm text-gray-300">
//                 {reply.caption}
//               </div>
//             ))}

//             {Number(comment.replies_count) > 0 && (
//               <button
//                 onClick={() => toggleReplies(comment.uuid)}
//                 className="mt-2 text-xs text-blue-400 hover:underline"
//               >
//                 {commentsWithReplies[comment.uuid]?.loadedReplies
//                   ? "Hide replies"
//                   : `View replies (${comment.replies_count})`}
//               </button>
//             )}
//           </div>
//         ))}
//         <div ref={observerTarget} />
//       </div> */}
//       {replies.length > 0 ? (
//         <div className="flex flex-col divide-y divide-gray-800">
//           {replies.map((reply) => {
//             return (
//               <div key={reply.uuid} className="flex gap-3 p-4">
//                 <CustomAvatar
//                   src={reply.user?.profile_picture || ""}
//                   name={reply.user?.name || ""}
//                   className="size-8 border-foreground border-[1.5px]"
//                 />
//                 <div className="flex-1">
//                   {/* Header */}
//                   <div className="flex flex-col">
//                     <div className="flex items-center gap-2">
//                       <span className="font-semibold text-sm text-white">
//                         {reply.user?.name}
//                       </span>
//                       <span className="text-xs text-gray-400">
//                         · {reply.formatted_time}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-400 my-1">
//                       @{reply.user?.username}
//                     </div>
//                   </div>

//                   {/* Caption */}
//                   <p className="text-sm text-gray-200 mt-4">{reply.caption}</p>

//                   {/* Media */}
//                   {reply.media?.length === 1 && (
//                     <div className="mt-2 rounded-xl overflow-hidden">
//                       {reply.media[0].media_type === "image" ? (
//                         <Image
//                           src={reply.media[0].media_url}
//                           alt="reply media"
//                           width={500}
//                           height={500}
//                           className="rounded-xl object-contain"
//                         />
//                       ) : (
//                         <PostVideo
//                           media={reply.media[0]}
//                           src={reply.media[0].media_url}
//                           currentVideoPlaying={currentVideoPlaying}
//                           setCurrentVideoPlaying={setCurrentVideoPlaying}
//                           isPlayingVideo={isPlayingVideo}
//                           setIsPlayingVideo={setIsPlayingVideo}
//                           isGloballyMuted={isMuted}
//                           setGlobalMuteState={setIsMuted}
//                           className="rounded-xl aspect-[4/5] max-h-[400px]"
//                         />
//                       )}
//                     </div>
//                   )}

//                   {reply.media?.length > 1 && (
//                     <div className="mt-2">
//                       <Carousel>
//                         <CarouselContent>
//                           {reply.media.map((media, index) => (
//                             <CarouselItem key={index}>
//                               {media.media_type === "image" ? (
//                                 <Image
//                                   src={media.media_url}
//                                   alt="reply media"
//                                   width={500}
//                                   height={500}
//                                   className="rounded-xl object-contain"
//                                 />
//                               ) : (
//                                 <PostVideo
//                                   media={media}
//                                   src={media.media_url}
//                                   currentVideoPlaying={currentVideoPlaying}
//                                   setCurrentVideoPlaying={
//                                     setCurrentVideoPlaying
//                                   }
//                                   isPlayingVideo={
//                                     activeIndex === index && isPlayingVideo
//                                   }
//                                   setIsPlayingVideo={setIsPlayingVideo}
//                                   isGloballyMuted={isMuted}
//                                   setGlobalMuteState={setIsMuted}
//                                   showEchoButtons={false}
//                                   className="rounded-xl aspect-[4/5] max-h-[400px]"
//                                 />
//                               )}
//                             </CarouselItem>
//                           ))}
//                         </CarouselContent>
//                         <CarouselPrevious />
//                         <CarouselNext />
//                       </Carousel>
//                     </div>
//                   )}

//                   <SocialPostActionButtons
//                     setPosts={setPosts}
//                     likeUnlikePost={() => {}}
//                     saveUnsavePost={() => {}}
//                     post={post}
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : isLoadingReplies ? (
//         <p className="p-4 text-sm text-gray-400">Loading replies...</p>
//       ) : (
//         initialFetchDone && (
//           <p className="p-4 text-sm text-gray-400">No replies yet.</p>
//         )
//       )}
//       <div ref={observerTarget} />
//     </div>
//   );
// };

// export default PostDetails;

// import { Button } from "components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
// import { AspectRatio } from "components/ui/aspect-ratio";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "components/ui/carousel";
// import type { CarouselApi } from "components/ui/carousel";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { IoClose } from "react-icons/io5";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import usePost from "src/hooks/usePost";
// import CommentInput from "./CommentInput";
// import PostHeader from "./PostHeader";
// import PostText from "./PostText";
// import PostVideo from "./PostVideo";
// import SocialComment from "./SocialComment";
// import SocialPostActionButtons from "./SocialPostActionButtons";
// import { Separator } from "components/ui/separator";

// const PostDetails = ({
//   post,
//   open,
//   setPosts,
//   user,
//   likeUnlikePost,
//   saveUnsavePost,
//   currentVideoPlaying,
//   setCurrentVideoPlaying,
//   isPlayingVideo,
//   setIsPlayingVideo,
//   initialMediaIndex = 0,
// }: {
//   post: IPost;
//   user: IUser;
//   open: boolean;
//   setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
//   likeUnlikePost: (postId: string) => void;
//   saveUnsavePost: (postId: string) => void;
//   currentVideoPlaying: string;
//   setCurrentVideoPlaying: (mediaID: string) => void;
//   isPlayingVideo: boolean;
//   setIsPlayingVideo: (playing: boolean) => void;
//   initialMediaIndex?: number;
// }) => {
//   const {
//     replyingTo,
//     setReplyingTo,
//     newComment,
//     setNewComment,
//     postCommentLoading,
//     setCommentsWithReplies,
//     comments,
//     setComments,
//     commentsWithReplies,
//     handleEmojiClick,
//     handleSubmitComment,
//   } = usePost(post, setPosts);

//   // State for carousel
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(initialMediaIndex);
//   const [api, setApi] = useState<CarouselApi | null>(null);

//   const [isGloballyMuted, setIsGloballyMuted] = useState(true);

//   const activeMedia = post?.media?.[currentMediaIndex];

//   // Set initial carousel position
//   // useEffect(() => {
//   //   if (api && initialMediaIndex !== undefined) {
//   //     api.scrollTo(initialMediaIndex);
//   //   }
//   // }, [api, initialMediaIndex]);

//   // // Ensure video is paused when modal opens or closes
//   // useEffect(() => {
//   //   if (!open) {
//   //     setIsPlayingVideo(false);
//   //     setCurrentVideoPlaying("");
//   //   }
//   // }, [open, setIsPlayingVideo, setCurrentVideoPlaying]);

//   // // Handle video state when changing slides
//   // useEffect(() => {
//   //   const handleSlideChange = () => {
//   //     if (isPlayingVideo) {
//   //       setIsPlayingVideo(false);
//   //       setCurrentVideoPlaying("");
//   //     }
//   //   };

//   //   if (api) {
//   //     api.on("select", handleSlideChange);
//   //     return () => {
//   //       api.off("select", handleSlideChange);
//   //     };
//   //   }
//   // }, [api, isPlayingVideo, setIsPlayingVideo, setCurrentVideoPlaying]);

//   // // Determine if there is more than one media item
//   // const hasMultipleMedia = post?.media && post.media.length > 1;

//   return (

//     <div className="flex flex-col gap-4">
//       {/* Post header (user info, time, etc.) */}
//       <PostHeader post={post} />

//       {/* Main Media */}
//       {activeMedia && (
//         <div className="relative w-full rounded-xl overflow-hidden">
//           {activeMedia.media_type === "image" && (
//             <Image
//               src={activeMedia.media_url}
//               alt="post"
//               width={800}
//               height={600}
//               className="w-full h-auto object-cover rounded-xl"
//               priority
//             />
//           )}

//           {activeMedia.media_type === "video" && (
//             <PostVideo
//               media={activeMedia}
//               currentVideoPlaying={currentVideoPlaying}
//               setCurrentVideoPlaying={setCurrentVideoPlaying}
//               src={activeMedia.media_url}
//               showEchoButtons={true}
//               isPlayingVideo={isPlayingVideo}
//               setIsPlayingVideo={setIsPlayingVideo}
//               className="aspect-[16/9] max-h-[500px]"
//               isGloballyMuted={isGloballyMuted}
//               setGlobalMuteState={setIsGloballyMuted}
//             />
//           )}
//         </div>
//       )}

//       {/* Media thumbnails if more than one */}
//       {post?.media?.length > 1 && (
//         <div className="flex gap-2 overflow-x-auto pb-2">
//           {post.media.map((media, index) => (
//             <div
//               key={`${media.uuid}-${index}`}
//               onClick={() => setCurrentMediaIndex(index)}
//               className={`relative w-20 h-20 rounded-md overflow-hidden border cursor-pointer ${
//                 currentMediaIndex === index ? "border-primary" : "border-gray-300"
//               }`}
//             >
//               {media.media_type === "image" && (
//                 <Image
//                   src={media.media_url}
//                   alt="thumb"
//                   fill
//                   className="object-cover"
//                 />
//               )}
//               {media.media_type === "video" && (
//                 <video
//                   src={media.media_url}
//                   className="w-full h-full object-cover"
//                   muted
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Post caption */}
//       <PostText text={post.caption} />

//       {/* Action buttons (Like, Comment, Save, etc.) */}
//       <SocialPostActionButtons
//         setPosts={setPosts}
//         likeUnlikePost={likeUnlikePost}
//         saveUnsavePost={saveUnsavePost}
//         post={post}
//       />

//       <Separator />

//       {/* Comments Section */}
//       <div className="flex flex-col gap-3">
//         <p className="text-sm font-medium text-gray-400">
//           Replies coming here...
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PostDetails;
