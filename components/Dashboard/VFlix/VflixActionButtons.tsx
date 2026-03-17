import { IoMdShareAlt } from "react-icons/io";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { PiHeartFill } from "react-icons/pi";

const VflixActionButtons = ({
  disableCommentButton = false,
  likeUnlikeVflix,
  post,
  setVideos,
  onCommentClick,
  onShareClick,
}: {
  disableCommentButton?: boolean;
  likeUnlikeVflix: (postId: string, source?: string) => void;
  post: IVflix;
  setVideos: React.Dispatch<React.SetStateAction<IVflix[]>>;
  onCommentClick: () => void;
  onShareClick: () => void;
}) => {
  return (
    <div className="flex flex-row justify-between items-center pt-2">
      <div className="flex flex-row gap-x-7 items-center relative z-40">
        <div className="flex flex-row gap-x-1 items-center">
          <PiHeartFill
            onClick={(e) => {
              e.stopPropagation();
              likeUnlikeVflix(post.uuid, post._source);
            }}
            className={`w-5 h-5 cursor-pointer transition-colors ${post.is_liked ? "text-red-600" : "text-white"}`}
          />
          <p className="text-sm">{post?.likes_count ?? 0}</p>
        </div>
        <div
          className="flex flex-row gap-x-1 items-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (!disableCommentButton) onCommentClick();
          }}
        >
          <IoChatbubbleEllipses className="w-5 h-5" />
          <p className="text-sm">{post.comments_count}</p>
        </div>
        <div
          className="flex flex-row gap-x-1 items-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onShareClick();
          }}
        >
          <IoMdShareAlt className="w-5 h-5" />
          <p className="text-sm">{post?.shares_count ?? 0}</p>
        </div>
      </div>
    </div>
  );
};

export default VflixActionButtons;
