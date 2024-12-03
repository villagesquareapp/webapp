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

  return (
    <div className="flex flex-col gap-y-4">
      <PostHeader post={post} />
      <div
        className={`grid ${post.media?.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-4 px-4`}
      >
        {post?.media?.map((media) => (
          <div key={media?.uuid}>
            {media?.media_type === "image" && (
              <div className="w-full aspect-[4/5] relative rounded-xl overflow-hidden">
                <Image
                  className="object-cover"
                  src={media?.media_url}
                  alt="post"
                  fill
                  sizes="500px"
                  quality={90}
                  priority
                />
              </div>
            )}
            {media?.media_type === "video" && (
              <PostVideo src={media?.media_url} showEchoButtons={false} />
            )}
          </div>
        ))}
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
