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

const SocialPostComment = ({
  post,
  disableCommentButton = false,
  setPosts,
}: {
  post: IPost;
  disableCommentButton?: boolean;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
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
    <Dialog
      open={openCommentDialog && !disableCommentButton}
      onOpenChange={setOpenCommentDialog}
    >
      <DialogTrigger>
        <div className="flex flex-row gap-x-1 items-center">
          <IoChatbubbleEllipses className="size-6" />
          <p className="text-sm">{post.replies_count}</p>
        </div>
      </DialogTrigger>
      {/* <DialogContent className="max-w-[800px] !max-h-[900px] overflow-hidden p-0">
        <DialogHeader className="sticky top-0 bg-background border-b z-50">
          <div className="flex items-center justify-between px-6 py-3">
            <DialogTitle className="text-center flex-1">
              Comment ({post?.replies_count})
            </DialogTitle>
            <Button
              variant="ghost"
              className="p-1 px-2.5 rounded-full transition-colors"
              onClick={() => setOpenCommentDialog(false)}
            >
              <IoClose className="size-6" />
            </Button>
          </div>
        </DialogHeader>
        <div style={{ height: "calc(90dvh - 140px)" }} className="overflow-y-auto">
          <SocialComment
            comments={comments}
            setComments={setComments}
            onChangeReplyingTo={setReplyingTo}
            postId={post.uuid}
            commentsWithReplies={commentsWithReplies}
            setCommentsWithReplies={setCommentsWithReplies}
          />
        </div>
        <CommentInput
          userProfilePicture={post?.user?.profile_picture}
          onSubmitComment={handleSubmitComment}
          loading={postCommentLoading}
          handleEmojiClick={handleEmojiClick}
          replyingTo={replyingTo}
          content={newComment}
          onChangeContentAction={setNewComment}
          onCancelReply={() => setReplyingTo(null)}
        />
      </DialogContent> */}
    </Dialog>
  );
};

export default SocialPostComment;
