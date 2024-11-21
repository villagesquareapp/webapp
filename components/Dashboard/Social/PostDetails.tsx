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
import Comment from "./Comment";
import SocialComment from "./SocialComment";
import CommentInput from "./CommentInput";

const PostDetails = () => {
  const [openPostDetails, setOpenPostDetails] = useState(false);
  const postWriteup =
    "Ex aute fugiat do consequat ut cillum minim quis aliquip consectetur qui esse. Ea ut dolor amet excepteur ad do. #WixStudio #Good #Nice";

  return (
    <Dialog open={openPostDetails} onOpenChange={setOpenPostDetails}>
      <DialogTrigger>
        <IoEllipsisHorizontal className="size-6" />
      </DialogTrigger>
      <DialogContent className="!min-w-[85vw] !h-[95dvh] !max-h-[90dvh] overflow-hidden p-0">
        <DialogHeader className="sticky top-0 bg-background border-b z-50">
          <div className="flex items-center justify-between px-6 py-3">
            <DialogTitle className="text-center flex-1">Post Details</DialogTitle>
            <Button
              variant="ghost"
              className="p-1 px-2.5 rounded-full transition-colors"
              onClick={() => setOpenPostDetails(false)}
            >
              <IoClose className="size-6" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 h-[calc(90dvh-48px)]">
          <div className="w-full h-full relative flex items-center justify-center bg-black/5">
            <div className="relative w-full aspect-square">
              <Image
                src="/images/beautiful-image.jpg"
                alt="beautiful-image"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
          <div className="w-full h-full flex flex-col relative gap-y-3 overflow-y-auto">
            <div className="sticky top-0 bg-background">
              <PostHeader showMoreDetailButton={false} />
              <PostText text={postWriteup} />
              <SocialPostActionButtons disableCommentButton={true} />
              <Separator className="my-1" />
            </div>
            <SocialComment onChangeReplyingTo={() => {}} />
            <CommentInput
              replyingTo={null}
              content={""}
              onChangeContentAction={() => {}}
              onCancelReply={() => {}}
              handleEmojiClick={() => {}}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetails;
