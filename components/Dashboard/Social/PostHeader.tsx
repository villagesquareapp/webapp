"use client";

import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Separator } from "components/ui/separator";
import { BsDot } from "react-icons/bs";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { IoEllipsisHorizontal } from "react-icons/io5";

const PostHeader = ({ showMoreDetailButton = true }: { showMoreDetailButton?: boolean }) => {
  return (
    <div className="flex justify-between items-center h-12  px-4">
      {/* Post Header */}
      <div className="flex flex-row gap-x-3 items-center">
        <CustomAvatar
          src="https://github.com/shadcn.png"
          name="CN"
          className="size-12 border-foreground border-[1.5px]"
        />
        <div className="flex flex-col gap-y-1">
          <span className="flex flex-row gap-x-2 items-center">
            <span className="font-semibold text-sm">John Doe</span>
            <HiMiniCheckBadge className="size-5 text-green-600" />
          </span>
          <span className="flex flex-row items-center gap-x-1">
            <span className="text-xs text-muted-foreground">New York, US</span>{" "}
            <span>
              <BsDot />
            </span>
            <p className="text-xs text-muted-foreground">2h</p>
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
            <PopoverContent align="end" className="w-fit p-0 text-center z-[50]">
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
