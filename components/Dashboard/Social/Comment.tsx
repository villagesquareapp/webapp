import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { PiHeartFill } from "react-icons/pi";

const Comment = ({
  type,
  onChangeReplyingTo,
}: {
  type: "mainComment" | "subComment";
  onChangeReplyingTo: (replyingTo: string | null) => void;
}) => {

  
  
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-x-4">
          <Avatar
            className={`${
              type === "mainComment" ? "size-12" : "size-10"
            } border-foreground border`}
          >
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-y-1">
            <span className="flex flex-row gap-x-2 items-center">
              <span className="font-semibold text-sm">John Doe</span>
              <HiMiniCheckBadge className="size-5 text-green-600" />
            </span>{" "}
            <div className="flex flex-row gap-x-3 justify-between">
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
              </p>
              <span className="text-sm text-muted-foreground">Report</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-x-8 ml-16">
          <div className="flex flex-row gap-x-1 items-center">
            <PiHeartFill className="size-5" />
            <p className="text-sm">12</p>
          </div>
          <div
            onClick={() =>onChangeReplyingTo('Paulliano')}
            className="flex flex-row gap-x-1 items-center"
          >
            <IoChatbubbleEllipses className="size-5" />
            <p className="text-sm">12</p>
          </div>
        </div>
        <p className="text-muted-foreground">21h</p>
      </div>
    </div>
  );
};

export default Comment;
