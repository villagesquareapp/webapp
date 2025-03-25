import { Button } from "components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { AspectRatio } from "components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "components/ui/carousel";
import type { CarouselApi } from "components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import usePost from "src/hooks/usePost";
import CommentInput from "./CommentInput";
import PostHeader from "./PostHeader";
import PostText from "./PostText";
import PostVideo from "./PostVideo";
import SocialComment from "./SocialComment";
import SocialPostActionButtons from "./SocialPostActionButtons";

const PostDetails = ({
  post,
  onClose,
  open,
  setPosts,
  user,
  likeUnlikePost,
  saveUnsavePost,
  currentVideoPlaying,
  setCurrentVideoPlaying,
  isPlayingVideo,
  setIsPlayingVideo,
  initialMediaIndex = 0,
}: {
  post: IPost;
  user: IUser;
  onClose: () => void;
  open: boolean;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  likeUnlikePost: (postId: string) => void;
  saveUnsavePost: (postId: string) => void;
  currentVideoPlaying: string;
  setCurrentVideoPlaying: (mediaID: string) => void;
  isPlayingVideo: boolean;
  setIsPlayingVideo: (playing: boolean) => void;
  initialMediaIndex?: number;
}) => {
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
    handleSubmitComment,
  } = usePost(post, setPosts);

  // State for carousel
  const [currentMediaIndex, setCurrentMediaIndex] = useState(initialMediaIndex);
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Set initial carousel position
  useEffect(() => {
    if (api && initialMediaIndex !== undefined) {
      api.scrollTo(initialMediaIndex);
    }
  }, [api, initialMediaIndex]);

  // Ensure video is paused when modal opens or closes
  useEffect(() => {
    if (!open) {
      setIsPlayingVideo(false);
      setCurrentVideoPlaying("");
    }
  }, [open, setIsPlayingVideo, setCurrentVideoPlaying]);

  // Handle video state when changing slides
  useEffect(() => {
    const handleSlideChange = () => {
      if (isPlayingVideo) {
        setIsPlayingVideo(false);
        setCurrentVideoPlaying("");
      }
    };

    if (api) {
      api.on("select", handleSlideChange);
      return () => {
        api.off("select", handleSlideChange);
      };
    }
  }, [api, isPlayingVideo, setIsPlayingVideo, setCurrentVideoPlaying]);

  // Determine if there is more than one media item
  const hasMultipleMedia = post?.media && post.media.length > 1;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!min-w-[85vw] flex flex-col !h-[95dvh] !max-h-[90dvh] overflow-hidden p-0 gap-0">
        <DialogHeader className="sticky top-0 bg-background border-b z-50 m-0 p-0">
          <div className="flex items-center justify-between px-6 py-3">
            <DialogTitle className="text-center flex-1 m-0">Post Details</DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              className="p-1 px-2.5 rounded-full transition-colors"
            >
              <IoClose className="size-6" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 h-full">
          <div className="h-full flex items-center justify-center overflow-y-auto col-span-1 w-full bg-black/35 p-4 relative">
            {post?.media?.length > 0 ? (
              <div className="w-full max-w-3xl relative">
                <Carousel
                  opts={{
                    align: "center",
                    loop: false,
                    dragFree: true,
                    containScroll: "trimSnaps",
                    skipSnaps: false,
                  }}
                  className="w-full"
                  setApi={(api) => {
                    setApi(api);
                    api?.on("select", () => {
                      const newIndex = api.selectedScrollSnap();
                      // Only update if the index actually changed
                      if (newIndex !== currentMediaIndex) {
                        setCurrentMediaIndex(newIndex);
                      }
                    });
                  }}
                >
                  <CarouselContent>
                    {post.media.map((media, index) => (
                      <CarouselItem key={`${media.uuid}-${index}`}>
                        <div className="w-full overflow-hidden">
                          <div className="p-0">
                            {media.media_type === "image" && (
                              <AspectRatio ratio={3 / 4}>
                                <Image
                                  src={media.media_url}
                                  alt="Post image"
                                  fill
                                  className="object-contain"
                                  sizes="(max-width: 768px) 100vw, 40vw"
                                  priority
                                />
                              </AspectRatio>
                            )}
                            {media.media_type === "video" && (
                              <AspectRatio ratio={3 / 4}>
                                <PostVideo
                                  media={media}
                                  currentVideoPlaying={currentVideoPlaying}
                                  setCurrentVideoPlaying={setCurrentVideoPlaying}
                                  src={media.media_url}
                                  showEchoButtons={false}
                                  isPlayingVideo={isPlayingVideo}
                                  setIsPlayingVideo={setIsPlayingVideo}
                                  className="w-full h-full"
                                />
                              </AspectRatio>
                            )}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {hasMultipleMedia && (
                    <>
                      <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background" />
                      <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background" />
                    </>
                  )}
                </Carousel>

                {/* Media Indicator Dots */}
                {hasMultipleMedia && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {post.media.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentMediaIndex
                            ? "bg-primary"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        onClick={() => setCurrentMediaIndex(index)}
                        aria-label={`Go to media ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full max-w-xl p-6 bg-background rounded-xl shadow-md">
                <div className="text-xl font-semibold">
                  <PostText text={post?.caption} />
                </div>
              </div>
            )}
          </div>

          <div className="col-span-1 w-full h-full flex flex-col relative">
            <div className="sticky bg-background z-10 border-b pt-4 pb-2 px-4">
              <PostHeader post={post} showMoreDetailButton={false} />
              <div className="my-4 max-h-[400px] overflow-y-auto">
                <PostText text={post?.caption} />
              </div>
              <SocialPostActionButtons
                setPosts={setPosts}
                likeUnlikePost={likeUnlikePost}
                saveUnsavePost={saveUnsavePost}
                disableCommentButton={true}
                post={post}
              />
            </div>

            <div style={{ height: "calc(100% - 140px)" }} className="overflow-y-auto px-4">
              <div className="min-h-full pt-3">
                <SocialComment
                  postId={post?.uuid}
                  onChangeReplyingTo={setReplyingTo}
                  comments={comments}
                  setComments={setComments}
                  commentsWithReplies={commentsWithReplies}
                  setCommentsWithReplies={setCommentsWithReplies}
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-background mt-auto border-t px-4">
              <CommentInput
                user={user}
                replyingTo={replyingTo}
                content={newComment}
                onChangeContentAction={setNewComment}
                onCancelReply={() => setReplyingTo(null)}
                handleEmojiClick={handleEmojiClick}
                onSubmitComment={handleSubmitComment}
                loading={postCommentLoading}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetails;
