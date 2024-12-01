import { Separator } from "components/ui/separator";
import Image from "next/image";
import PostHeader from "./PostHeader";
import PostText from "./PostText";
import PostVideo from "./PostVideo";
import SocialPostActionButtons from "./SocialPostActionButtons";
import { useEffect, useState } from "react";
import { getPostComments } from "api/post";

const EachSocialPost = ({
  post,
  likeUnlikePost,
  saveUnsavePost,
}: {
  post: IPost;
  likeUnlikePost: (postId: string) => void;
  saveUnsavePost: (postId: string) => void;
}) => {
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
      <PostText text={post?.caption} />
      <SocialPostActionButtons
        likeUnlikePost={likeUnlikePost}
        saveUnsavePost={saveUnsavePost}
        post={post}
      />
      <Separator className="my-2" />
    </div>
  );
};

export default EachSocialPost;
