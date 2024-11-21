"use client";

import { Separator } from "components/ui/separator";
import Image from "next/image";
import PostHeader from "./PostHeader";
import PostText from "./PostText";
import PostVideo from "./PostVideo";
import SocialPostActionButtons from "./SocialPostActionButtons";
import SocialPostFilterDialog from "./SocialPostFilterDialog";

const SocialPost = () => {
  const postWriteup =
    "Ex aute fugiat do consequat ut cillum minim quis aliquip consectetur qui esse. Ea ut dolor amet excepteur ad do. #WixStudio #Good #Nice";

  let postType = "video";

  console.log("MapKEY:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="border-b-[1.5px] flex justify-between">
        <div className="flex flex-row">
          {/* @Todo Font is bold and primary border when selected */}
          <span className="py-3 px-5 text-lg border-b-4 border-primary">For You</span>
          <span className="py-3 px-5 text-lg">Following</span>
        </div>
        <SocialPostFilterDialog />
      </div>
      <div className="border rounded-xl flex flex-col gap-y-4 py-4 ">
        {/* Post */}
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="flex flex-col gap-y-4">
            <PostHeader />
            {/* Image Post - optimized for 500px width */}
            {postType === "image" && (
              <div className="px-4">
                <div className="w-full  aspect-[4/5] relative rounded-xl overflow-hidden">
                  <Image
                    className="object-cover"
                    src="/images/beautiful-image.jpg"
                    alt="post"
                    fill
                    sizes="500px"
                    quality={90}
                    priority
                  />
                </div>
              </div>
            )}
            {/* Video Post */}
            {postType === "video" && (
              <div className="px-4">
                <PostVideo showEchoButtons={true} />
              </div>
            )}
            {/* Post text with highlighted hashtags */}
            <PostText text={postWriteup} />
            <SocialPostActionButtons />
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialPost;
