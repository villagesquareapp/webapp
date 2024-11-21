"use client";

import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import Image from "next/image";
import { useState } from "react";
import { BsDot } from "react-icons/bs";
import { CgEyeAlt } from "react-icons/cg";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { IoEllipsisHorizontal } from "react-icons/io5";
import ReactPlayer from "react-player";
import SocialPostFilterDialog from "./SocialPostFilterDialog";
import SocialPostActionButtons from "./SocialPostActionButtons";
import PostDetails from "./PostDetails";

const PostHeader = ({
  showMoreDetailButton = true,
}: {
  showMoreDetailButton?: boolean;
}) => {
  return (
    <div className="flex justify-between items-center h-12  px-4">
        {/* Post Header */}
        <div className="flex flex-row gap-x-3 items-center">
          <Avatar className="size-12 border-foreground border-[1.5px]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
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
        {showMoreDetailButton ? <PostDetails /> : <Button className="text-foreground">See Profile</Button>}
        </div>
      </div>
    );
}

export default PostHeader;