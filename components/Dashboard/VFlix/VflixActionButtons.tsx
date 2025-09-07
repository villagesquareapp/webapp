import { Gift } from "lucide-react";
import { IoMdShareAlt } from "react-icons/io";
import { PiHeartFill } from "react-icons/pi";

const VflixActionButtons = ({
  disableCommentButton = false,
  likeUnlikeVflix,
  post,
  setVideos,
}: {
  disableCommentButton?: boolean;
  likeUnlikeVflix: (postId: string) => void;
  post: IVflix;
  setVideos: React.Dispatch<React.SetStateAction<IVflix[]>>;
}) => {
  return (
    <div className="flex flex-row justify-between items-center pt-2">
      <div className="flex flex-row gap-x-7 items-center">
        <div className="flex flex-row gap-x-1 items-center">
          <PiHeartFill
            onClick={() => likeUnlikeVflix(post.uuid)}
            className={`w-5 h-5 cursor-pointer ${post.is_liked && "text-red-600"}`}
          />
          <p className="text-sm">{post?.likes_count ?? 0}</p>
        </div>
        {/* <SocialPostComment
          post={post}
          disableCommentButton={disableCommentButton}
          setVideos={setVideos}
        /> */}
        <div className="flex flex-row gap-x-1 items-center">
          <IoMdShareAlt className="w-5 h-5" />
          <p className="text-sm">{post?.shares_count ?? 0}</p>
        </div>
        <div className="flex flex-row gap-x-1 items-center">
          <Gift className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default VflixActionButtons;
