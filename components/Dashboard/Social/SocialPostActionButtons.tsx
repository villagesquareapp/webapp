"use client";

import { BsBookmarkDashFill } from "react-icons/bs";
import { IoMdShareAlt } from "react-icons/io";
import { PiHeartFill } from "react-icons/pi";
import SocialPostComment from "./SocialPostComment";
import { useEffect, useState } from "react";
import { BiBarChart } from "react-icons/bi";

const SocialPostActionButtons = ({
  disableCommentButton = false,
  likeUnlikePost,
  saveUnsavePost,
  post,
  user,
  setPosts,
  onOpenReplyModal,
}: {
  disableCommentButton?: boolean;
  likeUnlikePost: (postId: string) => void;
  saveUnsavePost: (postId: string) => void;
  post: IPost;
  user: IUser;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  onOpenReplyModal?: (post: IPost, replyToComment?: IPostComment) => void;
}) => {
  const [burst, setBurst] = useState<boolean>(false);
  return (
    <div className="flex flex-row justify-between items-center px-4">
      <div className="flex flex-row gap-x-6 items-center">
        <div className="flex flex-row gap-x-1 items-center">
          {/* <PiHeartFill
            onClick={() => likeUnlikePost(post.uuid)}
            className={`hover:scale-125 transition-transform pointer-events-auto size-5 cursor-pointer text-gray-500 ${
              post.is_liked && "text-red-600"
            }`}
          /> */}
          <PiHeartFill
            onClick={() => likeUnlikePost(post.uuid)}
            className={`hover:scale-125 transition-transform pointer-events-auto size-5 cursor-pointer text-gray-500 ${
              post.is_liked && "text-red-600"
            }`}
          />
          <p className="text-sm text-gray-400">{post?.likes_count}</p>
        </div>
        <SocialPostComment
          post={post}
          disableCommentButton={disableCommentButton}
          setPosts={setPosts}
          user={user}
          onOpenReplyModal={() => onOpenReplyModal?.(post)}
        />
        <div className="flex flex-row gap-x-1 items-center">
          <IoMdShareAlt className="size-5 cursor-pointer text-gray-500" />
          <p className="text-sm text-gray-400">{post?.shares_count}</p>
        </div>
        <div className="flex flex-row gap-x-1 items-center">
          <BsBookmarkDashFill
            onClick={() => saveUnsavePost(post.uuid)}
            className={`size-4 text-gray-400 ${
              post?.is_saved && "text-primary"
            } cursor-pointer`}
          />
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <p className="text-sm text-gray-400">{post?.views_count}</p>
        <BiBarChart className="size-6 text-gray-500" />
      </div>
    </div>
  );
};

export default SocialPostActionButtons;
