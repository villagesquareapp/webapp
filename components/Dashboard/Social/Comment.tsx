import CustomAvatar from "components/ui/custom/custom-avatar";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { PiHeartFill } from "react-icons/pi";

const Comment = ({
  comment,
  onReply,
  type,
  onLike,
}: {
  comment: IPostComment;
  onReply: () => void;
  type: "mainComment" | "subComment";
  onLike: () => void;
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-x-4 w-full">
          <CustomAvatar
            src={comment.user.profile_picture || ""}
            name={comment.user.name || comment.user.username || ""}
            className={`${
              type === "mainComment" ? "size-12" : "size-10"
            } border-foreground border`}
          />
          <div className="flex flex-col gap-y-1 w-full">
            <span className="flex flex-row gap-x-2 items-center">
              <span className="font-semibold text-sm">
                {comment.user.name || comment.user.username}
              </span>
              {comment.user.verified_status === 1 && (
                <HiMiniCheckBadge className="size-5 text-green-600" />
              )}
            </span>
            <div className="flex flex-row gap-x-3 items-start w-full justify-between">
              <div className="text-sm w-[85%]">
                <p className="flex flex-wrap">{comment.comment}</p>
              </div>
              <span className="text-sm text-muted-foreground">Report</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-x-8 ml-16">
          <div onClick={onLike} className="flex flex-row gap-x-1 items-center cursor-pointer">
            <PiHeartFill className={`size-5 ${comment.is_liked ? "text-red-500" : ""}`} />
            <p className="text-sm">{comment.likes_count}</p>
          </div>
          <div onClick={onReply} className="flex flex-row gap-x-1 items-center cursor-pointer">
            <IoChatbubbleEllipses className="size-5" />
            <p className="text-sm">{comment.reply_count}</p>
          </div>
        </div>
        <p className="text-muted-foreground">{comment.formatted_time}</p>
      </div>
    </div>
  );
};

export default Comment;
