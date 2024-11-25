"use client";

import { Button } from "components/ui/button";
import VSCoin from "components/ui/custom/vs-coin";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { useState } from "react";
import { FaVideo } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import LiveStreamDialog from "./LiveStreamDialog";

const LiveStreamAddInfo = () => {
  const [liveStreamInfo, setLiveStreamInfo] = useState({
    addingLiveStreamInfo: true,
    addingLiveStreamCamera: false,
    addingLiveStreamCohost: false,
  });
  const [selectedCohost, setSelectedCohost] = useState<string[] | null>(null);

  let sendingGift = false;
  let giftSent = false;
  let balanceInsufficient = false;
  let recharging = true;
  let recharged = false;

  const getTitle = () => {
    if (liveStreamInfo.addingLiveStreamInfo || liveStreamInfo.addingLiveStreamCamera)
      return "Go Live Streaming Information";
    if (liveStreamInfo.addingLiveStreamCohost) return "Add Cohost";
    return null;
  };

  const getFooter = () => {
    if (liveStreamInfo.addingLiveStreamInfo)
      return (
        <Button
          onClick={() =>
            setLiveStreamInfo({
              addingLiveStreamInfo: false,
              addingLiveStreamCohost: false,
              addingLiveStreamCamera: true,
            })
          }
          className="text-foreground"
          size="lg"
        >
          Next
        </Button>
      );
    return null;
  };

  return (
    <LiveStreamDialog
      removeFooterBorder={sendingGift ? true : false}
      contentClassName={`${
        giftSent || recharged || balanceInsufficient ? "w-[420px] h-[420px]" : "max-w-[650px]"
      } `}
      trigger={
        <Button className="ml-auto text-foreground rounded-full py-1 flex my-auto items-center relative">
          <FaVideo className="size-4" /> <span>Go Live</span>
        </Button>
      }
      title={getTitle()}
      leftAndRightButton={
        balanceInsufficient ? <span className="font-semibold">Recharge</span> : null
      }
      footer={getFooter()}
    >
      <div className={` h-full overflow-y-hidden`}>
        {liveStreamInfo.addingLiveStreamInfo && (
          <form
            onSubmit={() => console.log("Submitted")}
            className="h-full w-full flex flex-col gap-y-4"
          >
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="concern" className="font-semibold ">
                Title <span className="text-muted-foreground">{"(Optional)"}</span>
              </Label>
              <Input className="bg-accent no_input_border" placeholder="Title" />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="category" className="font-semibold">
                Category
              </Label>
              <Select>
                <SelectTrigger className="w-full !border-none !outline-none bg-accent !ring-0">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="category_one">Category one</SelectItem>
                    <SelectItem value="category_two">Category two</SelectItem>
                    <SelectItem value="category_three">Category three</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="concern" className="font-semibold ">
                Add Cohost <span className="text-muted-foreground">{"(Optional)"}</span>
              </Label>
              <div className="min-h-10 items-center px-4 h-fit w-full bg-accent rounded-xl flex-wrap flex relative">
                {selectedCohost ? (
                  <>
                    {selectedCohost.map((cohost) => (
                      <div className="flex flex-row gap-x-2">
                        <p>{cohost}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground"> Add Cohost</span>
                )}
                <div>
                  <IoIosArrowForward
                    onClick={() =>
                      setLiveStreamInfo({ ...liveStreamInfo, addingLiveStreamCohost: true })
                    }
                    className="size-5 absolute right-2 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="privacy" className="font-semibold">
                Privacy Settings
              </Label>
              <Select>
                <SelectTrigger className="w-full !border-none !outline-none bg-accent !ring-0">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="font-semibold  flex">
                Additional Settings{" "}
                <span className="text-muted-foreground">{"(Optional)"}</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </LiveStreamDialog>
  );
};

export default LiveStreamAddInfo;
