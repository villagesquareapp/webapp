import { Gift } from "lucide-react";
import { IoMdShareAlt } from "react-icons/io";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { PiHeartFill } from "react-icons/pi";
import { useState } from "react";
import ShareModal from "../Reusable/ShareModal";

const VflixActionButtons = ({
  disableCommentButton = false,
  likeUnlikeVflix,
  post,
  setVideos,
  onCommentClick,
}: {
  disableCommentButton?: boolean;
  likeUnlikeVflix: (postId: string) => void;
  post: IVflix;
  setVideos: React.Dispatch<React.SetStateAction<IVflix[]>>;
  onCommentClick: () => void;
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <div className="flex flex-row justify-between items-center pt-2">
        <div className="flex flex-row gap-x-7 items-center">
          <div className="flex flex-row gap-x-1 items-center">
            <PiHeartFill
              onClick={() => likeUnlikeVflix(post.uuid)}
              className={`w-5 h-5 cursor-pointer ${post.is_liked && "text-red-600"}`}
            />
            <p className="text-sm">{post?.likes_count ?? 0}</p>
          </div>
          <div className="flex flex-row gap-x-1 items-center">
            {!disableCommentButton && (
              <IoChatbubbleEllipses
                onClick={onCommentClick}
                className="w-5 h-5 cursor-pointer"
              />
            )}
            <p className="text-sm">{post.comments_count}</p>
          </div>
          <div className="flex flex-row gap-x-1 items-center">
            <div
              className="flex flex-row gap-x-1 items-center cursor-pointer"
              onClick={() => setIsShareOpen(true)}
            >
              <IoMdShareAlt className="w-5 h-5" />
              <p className="text-sm">{post?.shares_count ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
      <ShareModal
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        postId={post.uuid}
      />
    </>
  );
};

export default VflixActionButtons;
