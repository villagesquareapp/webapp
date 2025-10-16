"use client";

import { VSAddPerson } from "components/icons/village-square";
import { IoSearch } from "react-icons/io5";
import LiveStreamDialog from "./LiveStreamDialog";
import { useState } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Button } from "components/ui/button";

interface Friend {
  id: number;
  name: string;
  avatar: string;
  isInvited: boolean;
}

interface LiveStreamInviteFriendsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  streamData?: any;
  onClose?: () => void;
}

const LiveStreamInviteFriends = ({ open, onOpenChange, streamData, onClose }: LiveStreamInviteFriendsProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const [showQuestionAndAnswer, setShowQuestionAndAnswer] = useState(false);
  const [friends, setFriends] = useState<Friend[]>(
    Array.from({ length: 30 }).map((_, index) => ({
      id: index,
      name: "Micheal Jordan",
      avatar: "/images/vs-logo.webp",
      isInvited: false,
    }))
  );

  const handleInvite = (friendId: number) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === friendId ? { ...friend, isInvited: true } : friend
      )
    );
  };

  const handleCancelInvite = (friendId: number) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === friendId ? { ...friend, isInvited: false } : friend
      )
    );
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <LiveStreamDialog
      contentClassName="w-[650px] h-fit !max-h-[650px] py-6"
      trigger={
        <div className="bg-white/10 rounded-full flex size-10 place-content-center items-center cursor-pointer">
          <VSAddPerson className="size-7 flex -mb-1 -mr-1.5" />
        </div>
      }
      title={"Invite Friends"}
      open={open}
      onOpenChange={onOpenChange || handleClose}
    >
      <div className="h-full flex flex-col">
        <div className="w-full relative mb-4">
          <input
            type="search"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-accent h-10 w-full pl-4 pr-12 font-medium rounded-lg !outline-none !border-none !ring-0"
          />
          <IoSearch className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-foreground pointer-events-none" />
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-4 gap-6">
            {filteredFriends.map((friend) => (
              <div key={friend.id} className="flex flex-col w-full gap-y-2 place-items-center">
                <CustomAvatar
                  className="size-20"
                  src={friend.avatar}
                  name={friend.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                />
                <div className="w-[98%] mx-auto flex">
                  <p className="text-sm truncate">{friend.name}</p>
                </div>
                {!friend.isInvited ? (
                  <Button
                    size={"sm"}
                    className="w-full text-foreground px-5"
                    onClick={() => handleInvite(friend.id)}
                  >
                    Invite
                  </Button>
                ) : (
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="w-full border-2 border-primary/65 text-foreground px-5"
                    onClick={() => handleCancelInvite(friend.id)}
                  >
                    Invited
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LiveStreamDialog>
  );
};

export default LiveStreamInviteFriends;
