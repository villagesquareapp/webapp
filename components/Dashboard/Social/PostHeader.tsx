"use client";

import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Separator } from "components/ui/separator";
import { BsDot } from "react-icons/bs";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { IoEllipsisHorizontal } from "react-icons/io5";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "%ds",
    ss: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1hr",
    hh: "%dhrs",
    d: "1d",
    dd: "%dd",
    M: "1mon",
    MM: "%dmons",
    y: "1yr",
    yy: "%dyrs",
  },
});

const PostHeader = ({
  showMoreDetailButton = true,
  post,
}: {
  showMoreDetailButton?: boolean;
  post: IPost;
}) => {
  return (
    <div key={post.uuid} className="flex justify-between items-center h-12  px-4">
      {/* Post Header */}
      <div className="flex flex-row gap-x-3 items-center">
        <CustomAvatar
          src={post?.user?.profile_picture || ""}
          name={post?.user?.name || ""}
          className="size-12 border-foreground border-[1.5px]"
        />
        <div className="flex flex-col gap-y-1">
          <span className="flex flex-row gap-x-2 items-center">
            <span className="font-semibold text-sm">{post?.user?.name}</span>
            {post?.user?.verified_status && (
              <HiMiniCheckBadge className="size-5 text-green-600" />
            )}
          </span>
          <span className="flex flex-row items-center gap-x-1">
            {post?.address && (
              <>
                <span className="text-xs text-muted-foreground">{post?.address}</span>{" "}
                <span>
                  <BsDot />
                </span>
              </>
            )}
            <p className="text-xs text-muted-foreground">
              {dayjs(post?.created_at).fromNow()}
            </p>
          </span>
        </div>
      </div>
      {/* Post Actions */}
      <div>
        {showMoreDetailButton ? (
          <Popover>
            <PopoverTrigger>
              <IoEllipsisHorizontal className="size-6" />
            </PopoverTrigger>
            <PopoverContent align="end" className="bg-background w-fit p-0 text-center z-[50]">
              <div className="text-sm px-20 py-3">Report</div>
              <Separator className="my-2" />
              <div className="px-20 py-3">Block</div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button className="text-foreground">See Profile</Button>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
