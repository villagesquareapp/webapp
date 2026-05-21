import { Separator } from "components/ui/separator";
import PostHeader from "./PostHeader";
import PostText from "./PostText";
import PostVideo from "./PostVideo";
import PostMediaCarousel from "./PostMediaCarousel";
import SocialPostActionButtons from "./SocialPostActionButtons";
import { useState } from "react";
import { useRouter } from "next/navigation";

const EachSocialPost = ({
  post,
  setPosts,
  user,
  likeUnlikePost,
  saveUnsavePost,
  currentVideoPlaying,
  setCurrentVideoPlaying,
  isPlayingVideo,
  setIsPlayingVideo,
  onOpenPostDetails,
  onOpenReplyModal,
}: {
  post: IPost;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  user: IUser;
  likeUnlikePost: (postId: string) => void;
  saveUnsavePost: (postId: string) => void;
  currentVideoPlaying: string;
  setCurrentVideoPlaying: (mediaID: string) => void;
  isPlayingVideo: boolean;
  setIsPlayingVideo: (playing: boolean) => void;
  onOpenPostDetails: () => void;
  onOpenReplyModal: () => void;
}) => {
  const router = useRouter();
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [clickedMediaIndex, setClickedMediaIndex] = useState(0);

  const [isGloballyMuted, setIsGloballyMuted] = useState(true);

  const handlePostClickWithVideoPause = (    e: React.MouseEvent,
    mediaIndex?: number
  ) => {
    e.stopPropagation();

    // Save scroll position before navigating to post details
    const scrollContainer = document.getElementById("social-main-scroll");
    if (scrollContainer) {
      sessionStorage.setItem("social-scroll-pos", String(scrollContainer.scrollTop));
    }

    if (isPlayingVideo) {
      setTimeout(() => {
        setIsPlayingVideo(false);
        setCurrentVideoPlaying("");
        router.push(`/posts/${post.uuid}`);
      }, 150);
    } else {
      router.push(`/posts/${post.uuid}`);
    }
  };

  const isSingleMedia = post?.media?.length === 1;

  return (
    <div className="flex flex-col gap-y-2 -mt-2 px-0 py-3 md:py-0 border-b md:border-b-0 border-gray-800">
      <PostHeader post={post} />

      <div
        className="flex flex-col cursor-pointer"
        onClick={(e) => handlePostClickWithVideoPause(e)}
      >
        {/* Post text with highlighted hashtags */}
        <div
          onClick={(e) => handlePostClickWithVideoPause(e)}
          className="cursor-pointer"
        >
          <PostText text={post?.caption} mentions={post?.mentions} />
        </div>
        {!!post?.media?.length && (
          <div className="md:px-0 mt-2" onClick={(e) => e.stopPropagation()}>
            <PostMediaCarousel
              media={post.media}
              currentVideoPlaying={currentVideoPlaying}
              setCurrentVideoPlaying={setCurrentVideoPlaying}
              isPlayingVideo={isPlayingVideo}
              setIsPlayingVideo={setIsPlayingVideo}
            />
          </div>
        )}
        <span className="flex flex-row items-center gap-x-1 mt-2">
          {post?.address && (
            <>
              <span className="text-xs text-muted-foreground">
                {post?.address}
              </span>{" "}
            </>
          )}
        </span>
      </div>

      <SocialPostActionButtons
        setPosts={setPosts}
        likeUnlikePost={likeUnlikePost}
        saveUnsavePost={saveUnsavePost}
        post={post}
        user={user}
        onOpenReplyModal={onOpenReplyModal}
      />
      <Separator className="mt-2 mb-2 md:my-0 hidden md:block opacity-80 -ml-4 lg:-ml-6 w-[calc(100%+32px)] lg:w-[calc(100%+48px)] max-w-none" />
    </div>
  );
};

export default EachSocialPost;