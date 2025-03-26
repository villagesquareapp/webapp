"use client";

import { VSAddPerson, VSChatAsk } from "components/icons/village-square";
import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { useEffect, useState } from "react";
import { BiSolidGift } from "react-icons/bi";
import { CgEyeAlt } from "react-icons/cg";
import { FaPause, FaPlay } from "react-icons/fa";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { IoIosInformationCircle, IoMdVolumeOff, IoMdWarning } from "react-icons/io";
import { IoVolumeMedium } from "react-icons/io5";
import { MdOutlinedFlag } from "react-icons/md";
import ReactPlayer from "react-player";
import SponsorCard from "../Reusable/SponsorCard";
import LikeButton from "./LikeButton";
import LiveFeaturedPreviewCard from "./LiveFeaturedPreviewCard";
import GoLiveButton from "./GoLiveButton";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { GoDotFill } from "react-icons/go";
import LiveStreamQuestionAndAnswer from "./LiveStreamQuestionAndAnswer";
import LiveStreamInviteFriends from "./LiveStreamInviteFriends";
import LiveStreamLeaveSession from "./LiveStreamLeaveSession";
import LiveStreamReport from "./LiveStreamReport";
import LiveStreamGift from "./LiveStreamGift";
import { HiDotsHorizontal } from "react-icons/hi";
import { Separator } from "components/ui/separator";

const LiveStream = ({ featuredLivestream }: { featuredLivestream: IFeaturedLivestream[] }) => {
  let turnedOffComment = false;
  let turnOffQuestion = false;
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  let isHost = true;
  let pausedLivestream = false;

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">
          Behind the Scenes: Exclusive Live Tour | Live Discussion
        </p>
        <GoLiveButton />
      </div>
      <div className="grid grid-cols-8 gap-x-4">
        <div className="col-span-6 gap-y-4 flex flex-col">
          <div className="w-full h-[66dvh] relative">
            {pausedLivestream && (
              <div className="absolute inset-0 z-30 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-row bg-accent gap-x-2 p-4 glassmorphism rounded-lg max-w-md">
                  <IoIosInformationCircle className="size-5 mt-2 flex shrink-0" />
                  <p className="text-sm flex">
                    The host has temporarily paused the video. Please wait until the host
                    restart it.
                  </p>
                </div>
              </div>
            )}

            <div className="absolute z-40 bg-red-600 font-medium text-xs top-4 left-4 rounded-full px-5 flex py-[5px] ">
              Live
            </div>
            <div className="w-full h-full relative">
              <div
                className="absolute inset-0 rounded-xl overflow-hidden bg-black"
                onClick={handleVideoClick}
              >
                <ReactPlayer
                  url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  width="100%"
                  height="100%"
                  playing={isPlaying}
                  muted={isMuted}
                  controls={false}
                  playsinline={true}
                  pip={true}
                  stopOnUnmount={true}
                  volume={0.8}
                  onProgress={(state) => setCurrentTime(state.playedSeconds)}
                />
              </div>
              <div
                className="absolute left-0 right-0 bottom-0 p-4 flex justify-between items-center z-40"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
                  borderBottomLeftRadius: "0.75rem",
                  borderBottomRightRadius: "0.75rem",
                }}
              >
                <div className="flex items-center gap-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(!isPlaying);
                    }}
                    className="text-white  hover:text-gray-200 transition"
                  >
                    {isPlaying ? (
                      <FaPause className="size-4" />
                    ) : (
                      <FaPlay className="size-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="text-white hover:text-gray-200 transition"
                  >
                    {isMuted ? (
                      <IoMdVolumeOff className="h-6 w-6" />
                    ) : (
                      <IoVolumeMedium className="size-6" />
                    )}
                  </button>
                </div>
                <div className="text-white text-sm">{formatTime(currentTime)}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-x-2">
              <CustomAvatar
                src="/images/beautiful-image.webp"
                className="border-2 size-[52px]"
                name="John Doe"
              />
              <div className="flex flex-col">
                <span className="flex flex-row gap-x-2 items-center">
                  <p className="font-semibold">John Doe</p>
                  <HiMiniCheckBadge className="size-5 text-green-600" />
                </span>
                <p className="text-muted-foreground text-sm">@micheal_jord</p>
              </div>
            </div>
            {isHost && (
              <Popover>
                <PopoverTrigger>
                  <HiDotsHorizontal className="size-6" />
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 w-[350px] place-items-center text-center"
                  side="top"
                  align="end"
                >
                  <div className="p-4">Add Cohost</div>
                  <Separator />
                  <div className="p-4">Turn Off Commenting</div>
                  <Separator />
                  <div className="p-4">Turn Off Questions</div>
                  <Separator />
                  <div className="p-4">End Session</div>
                </PopoverContent>
              </Popover>
            )}
            {!isHost && (
              <div className="flex items-center gap-x-3">
                <LiveStreamReport />
                <LiveStreamLeaveSession />
                <span className="bg-white/10 flex items-center backdrop-blur-sm rounded-full px-5 py-1 space-x-2">
                  <CgEyeAlt className="size-4" />
                  <p className="font-medium">123</p>
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col mt-4 gap-y-4">
            <p className="font-semibold">Featured Lives</p>
            <div className="grid lg:grid-cols-4 gap-4">
              {featuredLivestream?.map((featuredLivestreamData, index) => (
                <div key={index}>
                  <LiveFeaturedPreviewCard featuredLivestreamData={featuredLivestreamData} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col col-span-2 w-full gap-y-4">
          <Popover>
            <div className="flex flex-col rounded-xl border w-full p-4 h-[66dvh] relative">
              {/* Messages container with padding bottom to prevent overlap with sticky buttons */}
              {!turnedOffComment && (
                <div className="overflow-x-hidden overflow-y-auto no-scrollbar h-full pb-[100px]">
                  {/* Messages */}
                  <div className="flex flex-col gap-y-4 w-full overflow-x-hidden">
                    {Array.from({ length: 30 }).map((_, index) => (
                      <div key={index}>
                        <div className="flex flex-row gap-x-2 items-start w-full">
                          <CustomAvatar
                            src="/images/beautiful-image.webp"
                            className="border-2 size-10"
                            name="John Doe"
                          />
                          <div className="flex flex-col h-full">
                            <p className="font-medium text-sm">John Doe</p>
                            <p className="text-muted-foreground text-sm font-medium text-[13px]">
                              Lorem ipsum dolor sit tetur adipisicing elit. Quisquam, quos.
                              quos.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {turnedOffComment && (
                <div className="flex flex-row bg-accent gap-x-2 p-4 rounded-lg my-auto">
                  <IoIosInformationCircle className="size-5 mt-2 flex shrink-0" />
                  <p className="text-sm flex">
                    The host has turned off comments for this live stream.
                  </p>
                </div>
              )}

              {/* Sticky bottom section */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pt-2  py-3 bg-background">
                {!turnedOffComment && (
                  <textarea
                    placeholder="Add comment..."
                    className="w-full resize-none text-sm pt-2.5 h-10 !border-none !ring-none !outline-none rounded-lg pl-3 p-2 bg-accent"
                  />
                )}
                <div
                  className={`flex items-center mt-3 ${
                    turnedOffComment ? "place-content-center gap-x-2" : "justify-between"
                  }`}
                >
                  <div className="flex flex-row gap-x-2 items-center">
                    {!turnOffQuestion && <LiveStreamQuestionAndAnswer />}
                    {turnOffQuestion && (
                      <Popover>
                        <PopoverTrigger>
                          <div className="bg-white/10 rounded-full flex size-10 place-content-center items-center relative">
                            <GoDotFill className="size-5 absolute top-0 -right-1.5 text-red-600" />
                            <VSChatAsk className="size-7 flex -mb-1 -mr-1" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          side="top"
                          className="w-full mb-2 flex flex-row bg-accent border-2 border-white/10 shadow-md gap-x-2 p-4 rounded-lg"
                          sideOffset={16}
                        >
                          <IoIosInformationCircle className="size-5 mt-1 flex shrink-0" />
                          <p className="text-sm flex">
                            The host has turned off questions for <br /> this live stream.
                          </p>
                        </PopoverContent>
                      </Popover>
                    )}
                    <LiveStreamInviteFriends />
                    <LiveStreamGift />
                  </div>
                  <LikeButton />
                </div>
              </div>
            </div>
          </Popover>
          <SponsorCard sponsorType="liveStream" />
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
