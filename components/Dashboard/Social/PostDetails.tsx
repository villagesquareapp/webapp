"use client";

import { ArrowLeft } from "lucide-react";
import usePost from "src/hooks/usePost";
import SocialPostDetails from "./SocialPostDetails";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { useCallback, useEffect, useState } from "react";
import { likeOrUnlikePost, saveOrUnsavePost } from "api/post";
import {
  getPostCommentsClient,
  likeOrUnlikePostClient,
} from "app/api/post.client";
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
import { PostText } from "./PostText";
import { Separator } from "components/ui/separator";
import { useRouter } from "next/navigation";
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
  onOpenReplyModal: (post: IPost | IPostComment, replyToComment?: IPostComment) => void;
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
  newReply,
}: PostDetailsProps) => {
  const router = useRouter();

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
  const [localPost, setLocalPost] = useState<IPost>(post);

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const handleLikeMainPost = (postId: string) => {
    setLocalPost((prev) => ({
      ...prev,
      likes_count: prev.is_liked
        ? (Number(prev.likes_count) - 1).toString()
        : (Number(prev.likes_count) + 1).toString(),
      is_liked: !prev.is_liked,
    }));

    likeUnlikePost(postId);
  };

  const handleLocalReplySuccess = (newReply: IPostComment) => {
    setReplies((prev) => [newReply, ...prev]);

    setLocalPost((prev) => ({
      ...prev,
      replies_count: (Number(prev.replies_count) + 1).toString(),
    }));

    if (onReplySuccess) {
      onReplySuccess(newReply);
    }
  };

  const refetchReplies = useCallback(async () => {
    if (!user?.token) return;
    setIsLoadingReplies(true);
    try {
      const response = await getPostCommentsClient(post.uuid, user.token, 1);
      if (response?.status && response.data) {
        setReplies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setIsLoadingReplies(false);
    }
  }, [post.uuid, user.token]);

  const handleFetchReplies = async (page: number) => {
    if (!user?.token) return;
    setIsLoadingReplies(true);
    try {
      const response = await getPostCommentsClient(post.uuid, user.token, page);
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
          : reply,
      ),
    );

    try {
      if (!user?.token) return;
      const result = await likeOrUnlikePostClient(replyId, user.token);

      if (!result?.status) {
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
              : reply,
          ),
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
            : reply,
        ),
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
        <button onClick={onBack} className="">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-center md:pl-3">
          Post Details
        </h2>
      </div>

      {/* Top Border above Social Post Details */}
      <Separator className="opacity-40 -ml-4 lg:-ml-6 w-[calc(100%+32px)] lg:w-[calc(100%+48px)] max-w-none" />

      {/* Main Post (Fixed) */}
      <div className="">
        <div className="pt-2">
          <SocialPostDetails
            post={localPost}
            setPosts={setPosts}
            user={user}
            likeUnlikePost={handleLikeMainPost}
            saveUnsavePost={saveOrUnsavePost}
            currentVideoPlaying={currentVideoPlaying}
            setCurrentVideoPlaying={setCurrentVideoPlaying}
            isPlayingVideo={isPlayingVideo}
            setIsPlayingVideo={setIsPlayingVideo}
            onOpenReplyModal={() => onOpenReplyModal(localPost)}
          />
        </div>

        <Separator className="opacity-80 md:mt-4 -ml-4 lg:-ml-6 w-[calc(100%+32px)] lg:w-[calc(100%+48px)] max-w-none" />

        {/* Reply box */}
        <div className="flex items-center gap-3 py-3">
          <CustomAvatar
            src={user?.profile_picture || ""}
            name={post?.user?.name || ""}
            className="size-8 border-foreground border-[1.5px]"
          />
          <div className="flex-1">
            <button
              onClick={() => onOpenReplyModal(post)}
              className="w-full text-left text-sm text-gray-400 bg-transparent rounded-full"
            >
              Reply to post
            </button>
          </div>
        </div>
        <Separator className="opacity-80 -ml-4 lg:-ml-6 w-[calc(100%+32px)] lg:w-[calc(100%+48px)] max-w-none" />
        {/* Comments */}
        {isLoadingReplies ? (
          <LoadingSpinner />
        ) : replies.length > 0 ? (
          <div className="flex flex-col">
            {/* <Separator className="opacity-40 -ml-4 lg:-ml-6 w-[calc(100%+32px)] lg:w-[calc(100%+48px)] max-w-none" /> */}

            {replies.map((reply, index) => {
              return (
                <div className="">
                  <div key={reply.uuid} className="flex gap-3 pt-3">
                    <CustomAvatar
                      src={reply.user?.profile_picture || ""}
                      name={reply.user?.name || ""}
                      className="size-8 border-foreground border-[1.5px]"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col">
                        <div className="flex flex-row items-center max-w-80">
                          <span
                            className="font-semibold text-sm text-foreground cursor-pointer hover:underline"
                            onClick={() => reply.user?.username && router.push(`/u/${reply.user.username}`)}
                          >
                            {reply.user?.name}
                          </span>
                          {!!reply?.user?.verified_status && (
                            <HiMiniCheckBadge className="size-4 text-green-600 ml-1" />
                          )}
                          <span>
                            <BsDot />
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {reply.formatted_time}{" "}
                          </p>
                        </div>
                        <div
                          className="text-xs text-gray-400 cursor-pointer hover:underline w-fit"
                          onClick={() => reply.user?.username && router.push(`/u/${reply.user.username}`)}
                        >
                          @{reply.user?.username}
                        </div>
                      </div>
                      {/* <PostHeader post={reply} /> */}

                      {/* {reply.media?.length > 0 && (
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
                    )} */}
                    </div>
                  </div>
                  {/* <p className="text-sm text-gray-200 -mt-2 px-4">{reply.caption}</p> */}
                  <div className="my-3">
                    <PostText text={reply?.caption} />
                  </div>
                  <ReplyPostActionButtons
                    setPosts={setPosts}
                    likeUnlikePost={handleLikeReply}
                    saveUnsavePost={saveOrUnsavePost}
                    reply={reply}
                    onOpenReplyModal={() => onOpenReplyModal(reply)}
                  />
                  {/* Internal divider for all replies except the bottom one which is handled outside */}
                  {index < replies.length - 1 && (
                    <Separator className="mt-2 mb-2 opacity-80 -ml-4 lg:-ml-6 w-[calc(100%+32px)] lg:w-[calc(100%+48px)] max-w-none" />
                  )}
                </div>
              );
            })}

            {/* Bottom Border under last reply */}
            <Separator className="mt-2 opacity-80 -ml-4 lg:-ml-6 w-[calc(100%+32px)] lg:w-[calc(100%+48px)] max-w-none" />
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
