"use client";

import { VSAddPerson } from "components/icons/village-square";
import { IoSearch } from "react-icons/io5";
import LiveStreamDialog from "./LiveStreamDialog";
import { useState } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Button } from "components/ui/button";

const LiveStreamInviteFriends = () => {
  const [searchValue, setSearchValue] = useState("");
  let questionSent = false;
  let showQuestionAndAnswer = true;
  let notInvited = false;

  // @Todo Are you sure you want to join session?

  return (
    <LiveStreamDialog
      contentClassName={`${questionSent ? "w-[420px] h-[420px]" : "max-w-[650px]"} ${
        showQuestionAndAnswer && "h-[80dvh]"
      }`}
      trigger={
        <div className="bg-white/10 rounded-full flex size-10 place-content-center items-center">
          <VSAddPerson className="size-7 flex -mb-1 -mr-1.5" />
        </div>
      }
      title={"Invite Friends"}
    >
      <div className="h-full overflow-y-auto">
        <div className="flex  flex-col gap-y-4 pb-10">
          <div className="w-full relative">
            <input
              type="search"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-accent h-10 w-full pl-4 pr-12 font-medium rounded-lg !outline-none !border-none !ring-0"
            />
            <IoSearch className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-foreground pointer-events-none" />
          </div>
          <div className="grid grid-cols-4 gap-10">
            {Array.from({ length: 30 }).map((_, index) => (
              <div className="flex flex-col w-full gap-y-2 place-items-center">
                <CustomAvatar
                  className="size-24"
                  src="/images/beautiful-image.webp"
                  name="CN"
                />
                <div className="w-[98%] mx-auto flex">
                  <p className="text-sm truncate">Micheal Jordan sdkjdnsifdsuojf</p>
                </div>
                {notInvited && (
                  <Button size={"sm"} className="w-full text-foreground px-5">
                    Invite
                  </Button>
                )}
                <Button
                  variant={"outline"}
                  size={"sm"}
                  className="w-full border-2 border-primary/65 text-foreground px-5"
                >
                  Invited
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LiveStreamDialog>
  );
};

export default LiveStreamInviteFriends;
