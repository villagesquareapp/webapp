import Image from "next/image";
import PostHeader from "./PostHeader";
import PostVideo from "./PostVideo";
import PostText from "./PostText";
import SocialPostActionButtons from "./SocialPostActionButtons";
import { Separator } from "components/ui/separator";

const EachSocialPost = ({ post }: { post: IPost }) => {
  return (
    <div key={post.uuid} className="flex flex-col gap-y-4">
      <PostHeader post={post} />
      {/* Image Post - optimized for 500px width */}
      <div
        key={post.uuid}
        className={`grid ${post.media?.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-4 px-4`}
      >
        {post?.media?.map((media) => (
          <>
            {media?.media_type === "image" && (
              <div
                key={media?.uuid}
                className="w-full  aspect-[4/5] relative rounded-xl overflow-hidden"
              >
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
              <PostVideo src={media?.media_url} showEchoButtons={true} />
            )}
          </>
        ))}
      </div>
      {/* Post text with highlighted hashtags */}
      <PostText text={post?.caption} />
      <SocialPostActionButtons post={post} />
      <Separator className="my-2" />
    </div>
  );
};

export default EachSocialPost;
