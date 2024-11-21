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

const SocialPostComment = ({
  disableCommentButton = false,
}: {
  disableCommentButton?: boolean;
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [openCommentDialog, setOpenCommentDialog] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    setContent((prev) => prev + emoji);
  };

  return (
    <Dialog
      open={openCommentDialog && !disableCommentButton}
      onOpenChange={setOpenCommentDialog}
    >
      <DialogTrigger>
        <div className="flex flex-row gap-x-1 items-center">
          <IoChatbubbleEllipses className="size-6" />
          <p className="text-sm">12</p>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[650px] !max-h-[90dvh] overflow-hidden p-0">
        <DialogHeader className="sticky top-0 bg-background border-b z-50">
          <div className="flex items-center justify-between px-6 py-3">
            <DialogTitle className="text-center flex-1">Comment (28)</DialogTitle>
            <Button
              variant="ghost"
              className="p-1 px-2.5 rounded-full transition-colors"
              onClick={() => setOpenCommentDialog(false)}
            >
              <IoClose className="size-6" />
            </Button>
          </div>
        </DialogHeader>
        <div style={{ height: "calc(90dvh - 140px)" }}>
          <SocialComment onChangeReplyingTo={setReplyingTo} />
        </div>
        <CommentInput
          handleEmojiClick={handleEmojiClick}
          replyingTo={replyingTo}
          content={content}
          onChangeContentAction={setContent}
          onCancelReply={() => setReplyingTo(null)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SocialPostComment;
