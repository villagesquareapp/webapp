"use client";

import { Button } from "components/ui/button";
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
import { Switch } from "components/ui/switch";
import { useState } from "react";
import { FaArrowLeft, FaVideo } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import LiveStreamDialog from "./LiveStreamDialog";
import { IoSearch } from "react-icons/io5";
import CustomAvatar from "components/ui/custom/custom-avatar";

const LiveStreamAddInfo = () => {
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);
  const [liveStreamInfo, setLiveStreamInfo] = useState({
    addingLiveStreamInfo: true,
    addingLiveStreamCamera: false,
    addingLiveStreamCohost: false,
  });
  const [selectedCohost, setSelectedCohost] = useState<string[] | null>(["John"]);
  const [searchValue, setSearchValue] = useState("");
  let questionSent = false;
  let showQuestionAndAnswer = true;
  let notInvited = false;

  let OBSStreamSource = true;

  let sendingGift = false;

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
    if (liveStreamInfo.addingLiveStreamCamera)
      return (
        <Button
          onClick={() =>
            setLiveStreamInfo({
              addingLiveStreamInfo: false,
              addingLiveStreamCohost: false,
              addingLiveStreamCamera: false,
            })
          }
          className="text-foreground"
          size="lg"
        >
          Go Live
        </Button>
      );
    if (liveStreamInfo.addingLiveStreamCohost)
      return (
        <Button
          onClick={() =>
            setLiveStreamInfo({
              addingLiveStreamInfo: true,
              addingLiveStreamCohost: false,
              addingLiveStreamCamera: false,
            })
          }
          className="text-foreground"
          size="lg"
        >
          Done
        </Button>
      );
    return null;
  };

  const addCohostHandler = () =>
    setLiveStreamInfo({
      addingLiveStreamInfo: false,
      addingLiveStreamCamera: false,
      addingLiveStreamCohost: true,
    });

  const backButtonHandler = () => {
    setLiveStreamInfo({
      addingLiveStreamInfo: true,
      addingLiveStreamCohost: false,
      addingLiveStreamCamera: false,
    });
  };

  return (
    <LiveStreamDialog
      trigger={
        <Button className="ml-auto text-foreground rounded-full py-1 flex my-auto items-center relative">
          <FaVideo className="size-4" /> <span>Go Live</span>
        </Button>
      }
      backIcon={
        !liveStreamInfo.addingLiveStreamInfo && (
          <FaArrowLeft className="size-5 cursor-pointer" onClick={backButtonHandler} />
        )
      }
      title={getTitle()}
      footer={getFooter()}
    >
      {liveStreamInfo.addingLiveStreamCohost && (
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
              {searchValue ?
                <IoSearch className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-foreground pointer-events-none" />
              :
                <MdCancel
                  onClick={() => setSearchValue("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-foreground pointer-events-none cursor-pointer"
                />
              }
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
                      Add as Cohost
                    </Button>
                  )}
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="w-full border-2 border-primary/65 text-foreground px-5"
                  >
                    Added as Cohost
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {liveStreamInfo.addingLiveStreamCamera && (
        <div className="h-full overflow-auto">
          <form
            onSubmit={() => console.log("Submitted")}
            className="h-full w-full flex flex-col gap-y-4"
          >
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="category" className="font-semibold">
                Stream Source
              </Label>
              <Select>
                <SelectTrigger className="w-full !border-none !outline-none bg-accent !ring-0">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Stream Source</SelectLabel>
                    <SelectItem value="webcam">Webcam</SelectItem>
                    <SelectItem value="hp_camera">OBS</SelectItem>
                    <SelectItem value="external_camera">External Camera</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {OBSStreamSource && (
              <>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="concern" className="font-semibold ">
                    Server
                  </Label>
                  <Input className="bg-accent no_input_border" placeholder="Server" />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="concern" className="font-semibold ">
                    Stream Source Key
                  </Label>
                  <Input
                    className="bg-accent no_input_border"
                    placeholder="Stream Source Key"
                  />
                </div>
              </>
            )}
          </form>
        </div>
      )}
      <div className={` h-full overflow-y-hidden`}>
        {liveStreamInfo.addingLiveStreamInfo && (
          <div className="h-full overflow-y-auto">
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
                <div className="min-h-10 items-center px-2 h-fit w-full bg-accent rounded-xl flex-wrap flex relative">
                  {selectedCohost ? (
                    <>
                      {selectedCohost.map((cohost) => (
                        <div className="flex flex-row gap-x-2 text-xs font-semibold items-center bg-black rounded-sm px-2 py-1.5">
                          <p>{cohost}</p>
                          <MdCancel className="size-5 cursor-pointer" />
                        </div>
                      ))}
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground"> Add Cohost</span>
                  )}
                  <div>
                    <IoIosArrowForward
                      onClick={addCohostHandler}
                      className="size-5 absolute cursor-pointer right-2 top-1/2 -translate-y-1/2"
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
              <div className="flex flex-col gap-y-3 pb-4">
                <div
                  onClick={() => setShowAdditionalSettings(!showAdditionalSettings)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="font-semibold flex">
                    Additional Settings{" "}
                    <span className="text-muted-foreground">{"(Optional)"}</span>
                  </div>
                  <IoIosArrowDown
                    className={`size-5 cursor-pointer transition-transform duration-500 ${
                      showAdditionalSettings ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {showAdditionalSettings && (
                  <>
                    <div className="flex flex-row justify-between">
                      <Label htmlFor="airplane-mode">Turn Off Comments</Label>
                      <Switch id="airplane-mode" />
                    </div>
                    <div className="flex flex-row justify-between">
                      <Label htmlFor="airplane-mode">Turn Off Questions</Label>
                      <Switch id="airplane-mode" />
                    </div>
                    <div className="flex flex-row justify-between">
                      <Label htmlFor="airplane-mode">Disable Gifting</Label>
                      <Switch id="airplane-mode" />
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </LiveStreamDialog>
  );
};

export default LiveStreamAddInfo;
