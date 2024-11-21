"use client";

import { BsBookmarkDashFill } from "react-icons/bs";
import { CgEyeAlt } from "react-icons/cg";
import { IoMdShareAlt } from "react-icons/io";
import { PiHeartFill } from "react-icons/pi";
import SocialPostComment from "./SocialPostComment";

const SocialPostActionButtons = ({
  disableCommentButton = false,
}: {
  disableCommentButton?: boolean;
}) => {
  return (
    <div className="flex flex-row justify-between items-center px-4">
      <div className="flex flex-row gap-x-7 items-center">
        {/* When actioned on - text-red-600 */}
        <div className="flex flex-row gap-x-1 items-center">
          <PiHeartFill className="size-6" />
          <p className="text-sm">12</p>
        </div>
        <div className="overflow-y-auto">
          <SocialPostComment disableCommentButton={disableCommentButton} />
        </div>
        <div className="flex flex-row gap-x-1 items-center">
          <IoMdShareAlt className="size-8" />
          <p className="text-sm">23</p>
        </div>
        <div className="flex flex-row gap-x-1 items-center">
          <BsBookmarkDashFill className="size-5" />
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <p className="text-sm">110</p>
        <CgEyeAlt className="size-6" />
      </div>
    </div>
  );
};

export default SocialPostActionButtons;
