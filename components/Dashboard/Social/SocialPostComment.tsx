import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { useState } from "react";
import { IoChatbubbleEllipses, IoClose } from "react-icons/io5";
import CommentInput from "./CommentInput";
import SocialComment from "./SocialComment";
// import { createComments } from "api/post";
import { toast } from "sonner";
import { CommentWithReplies } from "./types";
import usePost from "src/hooks/usePost";
import ReplyToPostModal from "./ReplyToPostModal";
import { on } from "events";

const SocialPostComment = ({
  post,
  disableCommentButton = false,
  setPosts,
  user,
  onOpenReplyModal,
}: {
  post: IPost;
  disableCommentButton?: boolean;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  user?: IUser;
  onOpenReplyModal?: () => void;
}) => {
  const {
    replyingTo,
    setReplyingTo,
    newComment,
    setNewComment,
    openCommentDialog,
    setOpenCommentDialog,
    postCommentLoading,
    setCommentsWithReplies,
    comments,
    setComments,
    commentsWithReplies,
    handleEmojiClick,
    // handleSubmitComment,
  } = usePost(post, setPosts);


  return (
    <div>
      <div
        className="flex flex-row gap-x-1 items-center cursor-pointer"
        onClick={onOpenReplyModal}
      >
        <IoChatbubbleEllipses className="size-5 text-gray-500" />
        <p className="text-sm text-gray-400">{post.replies_count}</p>
      </div>
    </div>
  );
};

export default SocialPostComment;
