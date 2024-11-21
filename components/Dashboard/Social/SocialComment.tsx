import { Separator } from "components/ui/separator";
import Comment from "./Comment";

const SocialComment = ({
  onChangeReplyingTo,
}: {
  onChangeReplyingTo: (replyingTo: string | null) => void;
}) => {
  return (
    <div className="overflow-y-auto flex-1" style={{ height: "calc(90dvh - 160px)" }}>
      <div className="flex flex-col gap-y-4 px-6 pt-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="flex flex-col gap-y-4">
            <Comment type={"mainComment"} onChangeReplyingTo={onChangeReplyingTo} />
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="w-[90%] gap-y-4 ml-auto flex flex-col">
                <Comment type={"subComment"} onChangeReplyingTo={onChangeReplyingTo} />
              </div>
            ))}
            <Separator className="mt-4 mb-2" />
          </div>
        ))}
      </div>
      <div className="flex-1 h-80"></div>
    </div>
  );
};

export default SocialComment;
