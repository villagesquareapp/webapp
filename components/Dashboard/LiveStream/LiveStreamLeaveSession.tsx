"use client";

import { VSAddPerson } from "components/icons/village-square";
import { IoSearch } from "react-icons/io5";
import LiveStreamDialog from "./LiveStreamDialog";
import { useState } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Button } from "components/ui/button";
import { IoMdWarning } from "react-icons/io";

const LiveStreamLeaveSession = () => {
  const [searchValue, setSearchValue] = useState("");
  let questionSent = false;
  let showQuestionAndAnswer = true;
  let notInvited = false;

  // @Todo Are you sure you want to join session?

  return (
    <LiveStreamDialog
      contentClassName="w-[420px] h-[280px] text-center p-0"
      leftAndRightButton={<span className="font-semibold text-sm">Yes, Leave</span>}
      trigger={
        <Button
          variant="outline"
          className="flex items-center w-[100px] bg-red-600 hover:bg-red-700 gap-x-1 rounded-full"
        >
          <IoMdWarning className="size-4" />
          Leave
        </Button>
      }
    >
      <div className="h-fit overflow-y-hidden gap-y-6 pt-20 flex flex-col">
        <p className="font-semibold text-lg ">Leave Session?</p>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to leave the <br /> live stream?
        </p>
      </div>
    </LiveStreamDialog>
  );
};

export default LiveStreamLeaveSession;