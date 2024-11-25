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
import PostHeader from "./PostHeader";
import PostText from "./PostText";
import SocialPostActionButtons from "./SocialPostActionButtons";
import { Separator } from "components/ui/separator";
import SocialComment from "./SocialComment";
import CommentInput from "./CommentInput";
import PostVideo from "./PostVideo";

const PostDetails = () => {
  const [openPostDetails, setOpenPostDetails] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const postWriteup =
    "Ex aute fugiat do consequat ut cillum minim quis aliquip consectetur qui esse. Ea ut dolor amet excepteur ad do. #WixStudio #Good #Nice";

  // Handle comment content changes
  const handleCommentContentChange = (content: string) => {
    setCommentContent(content);
  };

  // Handle reply to comment
  const handleReplyingTo = (commentId: string | null) => {
    setReplyingTo(commentId);
  };

  // Handle cancel reply
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setCommentContent((prev) => prev + emoji);
  };

  let postType = "text";

  // @Todo - Fix post centering

  return (
    <Dialog open={openPostDetails} onOpenChange={setOpenPostDetails}>
      <DialogTrigger>
        <IoEllipsisHorizontal className="size-6" />
      </DialogTrigger>
      <DialogContent className="!min-w-[85vw] !h-[95dvh] !max-h-[90dvh] overflow-hidden p-0 gap-0">
        <DialogHeader className="sticky top-0 bg-background border-b z-50 m-0 p-0">
          <div className="flex items-center justify-between px-6 py-3">
            <DialogTitle className="text-center flex-1 m-0">Post Details</DialogTitle>
            <Button
              variant="ghost"
              className="p-1 px-2.5 rounded-full transition-colors"
              onClick={() => setOpenPostDetails(false)}
            >
              <IoClose className="size-6" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 h-full">
          <div className="col-span-1 w-full h-full relative flex !place-content-center !items-center object-center bg-black/35">
            <div className="flex flex-col h-fit my-auto center place-self-center">
              {postType === "image" && (
                <div className="relative w-full aspect-square">
                  <Image
                    src="/images/beautiful-image.webp"
                    alt="beautiful-image"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              {postType === "text" && (
                <div className="w-[90%] flex mx-auto !text-center font-semibold text-xl">
                  <PostText text={postWriteup} />
                </div>
              )}
              {postType === "video" && <PostVideo showEchoButtons={false} />}
            </div>
          </div>
          <div className="col-span-1 w-full h-full flex flex-col relative">
            <div className="sticky bg-background z-10 border-b pt-4 pb-2">
              <PostHeader showMoreDetailButton={false} />
              <PostText text={postWriteup} />
              <SocialPostActionButtons disableCommentButton={true} />
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="min-h-full pt-3">
                <SocialComment onChangeReplyingTo={handleReplyingTo} />
              </div>
            </div>
            <div className="sticky bottom-0 bg-background mt-auto border-t">
              <CommentInput
                replyingTo={replyingTo}
                content={commentContent}
                onChangeContentAction={handleCommentContentChange}
                onCancelReply={handleCancelReply}
                handleEmojiClick={handleEmojiSelect}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetails;
