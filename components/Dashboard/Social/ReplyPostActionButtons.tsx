"use client";

import { BsBookmarkDashFill } from "react-icons/bs";
import { CgEyeAlt } from "react-icons/cg";
import { IoMdShareAlt } from "react-icons/io";
import { PiHeartFill } from "react-icons/pi";
import SocialPostComment from "./SocialPostComment";
import { useEffect } from "react";
import { Reply } from "lucide-react";
import { BiBarChart } from "react-icons/bi";

const ReplyPostActionButtons = ({
  disableCommentButton = false,
  likeUnlikePost,
  saveUnsavePost,
  reply,
  setPosts,
  user,
  onOpenReplyModal,
}: {
  disableCommentButton?: boolean;
  likeUnlikePost: (postId: string) => void;
  saveUnsavePost: (postId: string) => void;
  reply: IPost;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  user?: IUser;
  onOpenReplyModal: () => void;
}) => {
  return (
    <div className="flex flex-row justify-between items-center px-4 mt-2">
      <div className="flex flex-row gap-x-7 items-center">
        <div className="flex flex-row gap-x-1 items-center">
          <PiHeartFill
            onClick={() => likeUnlikePost(reply.uuid)}
            className={`size-6 cursor-pointer text-gray-500 ${
              reply.is_liked && "text-red-600"
            }`}
          />
          <p className="text-sm text-gray-400">{reply?.likes_count}</p>
        </div>
        <SocialPostComment
          post={reply}
          disableCommentButton={disableCommentButton}
          setPosts={setPosts}
          user={user}
          onOpenReplyModal={onOpenReplyModal}
        />
        <div className="flex flex-row gap-x-1 items-center">
          <IoMdShareAlt className="size-6 cursor-pointer text-gray-500" />
          <p className="text-sm text-gray-400">{reply?.shares_count}</p>
        </div>
        <div className="flex flex-row gap-x-1 items-center">
          <BsBookmarkDashFill
            onClick={() => saveUnsavePost(reply.uuid)}
            className={`size-5 ${
              reply?.is_saved && "text-primary"
            } size-5 cursor-pointer text-gray-500`}
          />
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <p className="text-sm text-gray-400">{reply?.views_count}</p>
        <BiBarChart className="size-6 text-gray-500" />
      </div>
    </div>
  );
};

export default ReplyPostActionButtons;
