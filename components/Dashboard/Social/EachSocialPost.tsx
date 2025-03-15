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
}: {
  post: IPost;
  likeUnlikePost: (postId: string) => void;
  saveUnsavePost: (postId: string) => void;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}) => {
  const [showPostDetail, setShowPostDetail] = useState<IPost | null>(null);

  const handlePostClick = () => {
    setShowPostDetail(post);
  };

  const handleRemovePostDetail = () => {
    setShowPostDetail(null);
  };

  // Determine if this is a single media post
  const isSingleMedia = post?.media?.length === 1;

  return (
    <div className="flex flex-col gap-y-4">
      <PostHeader post={post} />

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
                <PostVideo
                  src={media?.media_url}
                  showEchoButtons={false}
                  className={
                    isSingleMedia
                      ? "aspect-[4/5] max-h-[500px]"
                      : shouldSpanFull
                      ? "aspect-[16/9] max-h-[250px]"
                      : "aspect-[4/5]"
                  }
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Post text with highlighted hashtags */}
      <div onClick={handlePostClick} className="cursor-pointer">
        <PostText text={post?.caption} />
      </div>
      {showPostDetail && (
        <PostDetails
          likeUnlikePost={likeUnlikePost}
          saveUnsavePost={saveUnsavePost}
          open={showPostDetail === post}
          setPosts={setPosts}
          post={post}
          onClose={handleRemovePostDetail}
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
