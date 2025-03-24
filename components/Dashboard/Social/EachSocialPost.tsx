import { Separator } from "components/ui/separator";
import Image from "next/image";
import PostHeader from "./PostHeader";
import PostText from "./PostText";
import PostVideo from "./PostVideo";
import SocialPostActionButtons from "./SocialPostActionButtons";
import { useState } from "react";
import PostDetails from "./PostDetails";

const EachSocialPost = ({
  post,
  likeUnlikePost,
  saveUnsavePost,
  setPosts,
  currentVideoPlaying,
  setCurrentVideoPlaying,
  isPlayingVideo,
  setIsPlayingVideo,
}: {
  post: IPost;
  likeUnlikePost: (postId: string) => void;
  saveUnsavePost: (postId: string) => void;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  currentVideoPlaying: string;
  setCurrentVideoPlaying: (mediaID: string) => void;
  isPlayingVideo: boolean;
  setIsPlayingVideo: (playing: boolean) => void;
}) => {
  const [showPostDetail, setShowPostDetail] = useState<IPost | null>(null);

  const handlePostClick = () => {
    setShowPostDetail(post);
  };

  const handleRemovePostDetail = () => {
    setShowPostDetail(null);
  };

  // When navigating to post details, pause any playing videos
  const handlePostClickWithVideoPause = () => {
    if (isPlayingVideo) {
      setIsPlayingVideo(false);
      setCurrentVideoPlaying("");
    }
    handlePostClick();
  };

  // Determine if this is a single media post
  const isSingleMedia = post?.media?.length === 1;

  return (
    <div className="flex flex-col gap-y-4">
      <PostHeader post={post} />

      <div className="flex flex-col gap-y-4">
        {!!post?.media?.length && (
          <div className={`p-4 ${isSingleMedia ? "w-full" : "grid grid-cols-2 gap-1.5"}`}>
            {post?.media?.map((media, index, array) => {
              // For multiple media posts, check if this is a single item in the last row
              const isLastItem = index === array.length - 1;
              const isOddCount = array.length % 2 === 1;
              const shouldSpanFull = !isSingleMedia && isLastItem && isOddCount;

              return (
                <div
                  key={media?.uuid}
                  className={`${shouldSpanFull ? "col-span-2" : ""} ${
                    isSingleMedia ? "w-full" : ""
                  }`}
                >
                  {media?.media_type === "image" && (
                    <div
                      onClick={handlePostClickWithVideoPause}
                      className={`w-full relative rounded-xl overflow-hidden ${
                        isSingleMedia
                          ? "aspect-[4/5] max-h-[500px]"
                          : shouldSpanFull
                          ? "aspect-[16/9] max-h-[250px]"
                          : "aspect-[4/5]"
                      }`}
                    >
                      <Image
                        className="object-cover"
                        src={media?.media_url}
                        alt="post"
                        fill
                        sizes={isSingleMedia ? "100vw" : "500px"}
                        quality={90}
                        priority
                      />
                    </div>
                  )}
                  {media?.media_type === "video" && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <PostVideo
                        media={media}
                        currentVideoPlaying={currentVideoPlaying}
                        setCurrentVideoPlaying={setCurrentVideoPlaying}
                        src={media?.media_url}
                        showEchoButtons={false}
                        isPlayingVideo={isPlayingVideo}
                        setIsPlayingVideo={setIsPlayingVideo}
                        className={
                          isSingleMedia
                            ? "aspect-[4/5] max-h-[500px]"
                            : shouldSpanFull
                            ? "aspect-[16/9] max-h-[250px]"
                            : "aspect-[4/5]"
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* Post text with highlighted hashtags */}
        <div onClick={handlePostClickWithVideoPause} className="cursor-pointer">
          <PostText text={post?.caption} />
        </div>
      </div>
      {showPostDetail && (
        <PostDetails
          likeUnlikePost={likeUnlikePost}
          saveUnsavePost={saveUnsavePost}
          open={showPostDetail === post}
          setPosts={setPosts}
          post={post}
          onClose={handleRemovePostDetail}
          currentVideoPlaying={currentVideoPlaying}
          setCurrentVideoPlaying={setCurrentVideoPlaying}
          isPlayingVideo={isPlayingVideo}
          setIsPlayingVideo={setIsPlayingVideo}
        />
      )}
      <SocialPostActionButtons
        setPosts={setPosts}
        likeUnlikePost={likeUnlikePost}
        saveUnsavePost={saveUnsavePost}
        post={post}
      />
      <Separator className="my-2" />
    </div>
  );
};

export default EachSocialPost;
