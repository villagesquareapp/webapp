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
import LoadingSpinner from "../Reusable/LoadingSpinner";
import NotFoundResult from "../Reusable/NotFoundResult";
import { on } from "events";
import { toast } from "sonner";
import PostHeader from "./PostHeader";
import { HiMiniCheckBadge } from "react-icons/hi2";
import ReplyToPostModal from "./ReplyToPostModal";
import { BsDot } from "react-icons/bs";
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
  onOpenReplyModal: (post: IPost, replyToComment?: IPostComment) => void;
  onReplySuccess: (newReply: IPostComment) => void;
  newReply?: IPostComment | null;
  // isReplyModalOpen: boolean;
  // setIsReplyModalOpen: (open: boolean) => void;
}

const PostDetails = ({
  post,
  user,
  setPosts,
  onBack,
  likeUnlikePost,
  saveOrUnsavePost,
  currentVideoPlaying,
  setCurrentVideoPlaying,
  isPlayingVideo,
  setIsPlayingVideo,
  initialMediaIndex,
  onOpenReplyModal,
  onReplySuccess,
  newReply
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
  const [isMuted, setIsMuted] = useState<boolean>(true);
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

  useEffect(() => {
    handleFetchReplies(1);
  }, [post.uuid, post.replies_count]);

  // const handleReplySuccess = useCallback((newReply: IPostComment) => {
  //   setReplies((prev) => [newReply, ...prev]);

  //   if (onReplySuccess) {
  //     onReplySuccess(newReply);
  //   }
  // }, [onReplySuccess]);

  const handleLikeReply = useCallback(async (replyId: string) => {
    setReplies((prev) =>
      prev.map((reply) =>
        reply.uuid === replyId
          ? {
              ...reply,
              likes_count: reply.is_liked
                ? (Number(reply.likes_count) - 1).toString()
                : (Number(reply.likes_count) + 1).toString(),
              is_liked: !reply.is_liked,
            }
          : reply
      )
    );

    try {
      // Make API call
      const formData = new FormData();
      const result = await likeOrUnlikePost(replyId, formData);

      if (!result?.status) {
        // Revert optimistic update on failure
        setReplies((prev) =>
          prev.map((reply) =>
            reply.uuid === replyId
              ? {
                  ...reply,
                  likes_count: reply.is_liked
                    ? (Number(reply.likes_count) + 1).toString()
                    : (Number(reply.likes_count) - 1).toString(),
                  is_liked: !reply.is_liked,
                }
              : reply
          )
        );
        toast.error(result?.message || "Failed to update like");
      }
    } catch (error) {
      // Revert optimistic update on error
      setReplies((prev) =>
        prev.map((reply) =>
          reply.uuid === replyId
            ? {
                ...reply,
                likes_count: reply.is_liked
                  ? (Number(reply.likes_count) + 1).toString()
                  : (Number(reply.likes_count) - 1).toString(),
                is_liked: !reply.is_liked,
              }
            : reply
        )
      );
      console.error("Error liking reply:", error);
    }
  }, []);

  useEffect(() => {
    const mainPostMedia = post?.media?.[0];
    if (mainPostMedia && mainPostMedia.media_type === "video") {
      setCurrentVideoPlaying(mainPostMedia.uuid);
      setIsPlayingVideo(true);
    }
  }, [post.uuid, setCurrentVideoPlaying, setIsPlayingVideo]);

  useEffect(() => {
    if (newReply) {
      setReplies((prev) => [newReply, ...prev]);
    }
  }, [newReply]);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 py-2">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-lg font-semibold text-center">Post Details</h2>
      </div>

      {/* Main Post (Fixed) */}
      <div className="border border-gray-800 rounded-md">
        <div className="pt-2">
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
            src={user?.profile_picture || ""}
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
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm text-white">
                          {reply.user?.name}
                        </span>
                        {!!reply?.user?.verified_status && (
                          <HiMiniCheckBadge className="size-4 text-green-600" />
                        )}
                        <span className="text-xs text-gray-400 flex items-center mr-2">
                          <BsDot /> {reply.formatted_time}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 my-1">
                        @{reply.user?.username}
                      </div>
                    </div>
                    {/* <PostHeader post={reply} /> */}

                    <p className="text-sm text-gray-200 mt-2">
                      {reply.caption}
                    </p>

                    {reply.media?.length > 0 && (
                      <div className="mt-2">
                        <Carousel
                          onSelect={(api) => {
                            const carouselApi = api as any;
                            if (
                              carouselApi &&
                              typeof carouselApi.selectedScrollSnap ===
                                "function"
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
                                    src={media.transcoded_media_url}
                                    alt="reply media"
                                    width={500}
                                    height={500}
                                    className="rounded-xl object-contain"
                                  />
                                ) : (
                                  <PostVideo
                                    media={media}
                                    src={
                                      media.media_url ||
                                      media.transcoded_media_url
                                    }
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
                      likeUnlikePost={handleLikeReply}
                      saveUnsavePost={saveOrUnsavePost}
                      reply={reply}
                      onOpenReplyModal={() => onOpenReplyModal(reply)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6">
            <NotFoundResult content={<span>No Replies Yet.</span>} />
          </div>
        )}
        <div ref={observerTarget} />
      </div>
    </div>
  );
};

export default PostDetails;
