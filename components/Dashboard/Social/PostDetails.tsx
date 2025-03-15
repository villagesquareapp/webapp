import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { IoClose, IoEllipsisHorizontal } from "react-icons/io5";
import CommentInput from "./CommentInput";
import PostHeader from "./PostHeader";
import PostText from "./PostText";
import PostVideo from "./PostVideo";
import SocialComment from "./SocialComment";
import SocialPostActionButtons from "./SocialPostActionButtons";
import usePost from "src/hooks/usePost";

const PostDetails = ({
  post,
  onClose,
  open,
  setPosts,
  likeUnlikePost,
  saveUnsavePost,
}: {
  post: IPost;
  onClose: () => void;
  open: boolean;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  likeUnlikePost: (postId: string) => void;
  saveUnsavePost: (postId: string) => void;
}) => {
  const {
    replyingTo,
    setReplyingTo,
    newComment,
    setNewComment,
    postCommentLoading,
    setCommentsWithReplies,
    comments,
    setComments,
    commentsWithReplies,
    handleEmojiClick,
    handleSubmitComment,
  } = usePost(post, setPosts);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!min-w-[85vw] flex flex-col !h-[95dvh] !max-h-[90dvh] overflow-hidden p-0 gap-0">
        <DialogHeader className="sticky top-0 bg-background border-b z-50 m-0 p-0">
          <div className="flex items-center justify-between px-6 py-3">
            <DialogTitle className="text-center flex-1 m-0">Post Details</DialogTitle>
            <Button variant="ghost" className="p-1 px-2.5 rounded-full transition-colors">
              <IoClose className="size-6" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 h-full">
          <div className="h-[calc(100%-140px)] grid overflow-y-auto col-span-1 w-full  bg-black/35">
            <div
              className={`grid ${
                post.media?.length > 1 ? "grid-cols-2" : "grid-cols-1"
              } gap-4  h-fit my-auto center place-self-center`}
            >
              {post?.media?.map((media) => (
                <div key={media?.uuid} className="px-4">
                  {media?.media_type === "image" && (
                    <div className="w-full aspect-[4/5] relative rounded-xl overflow-hidden">
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
                    <PostVideo src={media?.media_url} showEchoButtons={false} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 w-full h-full flex flex-col relative">
            <div className="sticky bg-background z-10 border-b pt-4 pb-2">
              <PostHeader post={post} showMoreDetailButton={false} />
              <div className="my-4">
                <PostText text={post?.caption} />
              </div>
              <SocialPostActionButtons
                setPosts={setPosts}
                likeUnlikePost={likeUnlikePost}
                saveUnsavePost={saveUnsavePost}
                disableCommentButton={true}
                post={post}
              />
            </div>

            <div style={{ height: "calc(100% - 140px)" }} className="overflow-y-auto">
              <div className="min-h-full pt-3">
                <SocialComment
                  postId={post?.uuid}
                  onChangeReplyingTo={setReplyingTo}
                  comments={comments}
                  setComments={setComments}
                  commentsWithReplies={commentsWithReplies}
                  setCommentsWithReplies={setCommentsWithReplies}
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-background mt-auto border-t">
              <CommentInput
                replyingTo={replyingTo}
                content={newComment}
                onChangeContentAction={setNewComment}
                onCancelReply={() => setReplyingTo(null)}
                handleEmojiClick={handleEmojiClick}
                onSubmitComment={handleSubmitComment}
                loading={postCommentLoading}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetails;
