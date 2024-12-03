import { VSSend } from "components/icons/village-square";
import ReplyTextArea from "./ReplyTextArea";

import CustomAvatar from "components/ui/custom/custom-avatar";
import { Loader2 } from "lucide-react";
const CommentInput = ({
  replyingTo,
  content,
  onChangeContentAction,
  onCancelReply,
  handleEmojiClick,
  onSubmitComment,
  loading,
}: {
  replyingTo: IPostComment | null;
  content: string;
  onChangeContentAction: (content: string) => void;
  handleEmojiClick: (emoji: string) => void;
  onCancelReply: () => void;
  onSubmitComment: () => void;
  loading: boolean;
}) => {
  return (
    <div className="sticky bottom-0 bg-background border-t px-6 h-fit gap-y-4 py-4 flex flex-col">
      <div className="flex h-fit flex-row justify-between items-center">
        {["👍", "❤️", "👏", "😊", "😐", "🤩", "😢"].map((emoji, index) => (
          <span
            key={index}
            className="text-3xl cursor-pointer hover:scale-110 transition-transform"
            onClick={() => handleEmojiClick(emoji)}
          >
            {emoji}{" "}
          </span>
        ))}
      </div>
      <div className="flex flex-row h-fit gap-x-2 items-center">
        <CustomAvatar
          src="https://github.com/shadcn.png"
          name="CN"
          className="size-12 border-foreground border"
        />
        <ReplyTextArea
          replyingTo={replyingTo}
          content={content}
          onChangeContentAction={onChangeContentAction}
          onCancelReply={onCancelReply}
          className="w-full"
        />
        <div
          className="p-2 shrink-0 rounded-full size-12 place-content-center bg-primary items-center flex"
          onClick={onSubmitComment}
        >
          {loading ? (
            <Loader2 className="size-6 flex m-auto animate-spin" />
          ) : (
            <VSSend className="size-6 flex m-auto" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
