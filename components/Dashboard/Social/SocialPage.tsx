"use client";

import NotFoundResult from "components/Dashboard/Reusable/NotFoundResult";
import AddPost from "components/Dashboard/Social/AddPost";
import DailyLoginReward from "components/Dashboard/Social/DailyLoginReward";
import MessageShortcut from "components/Dashboard/Social/MessageShortcut";
import NewSocialField from "components/Dashboard/Social/NewSocialField";
import SocialFlash from "components/Dashboard/Social/SocialFlash";
import SocialMainWrapper from "components/Dashboard/Social/SocialMainWrapper";
import SocialPost from "components/Dashboard/Social/SocialPost";
import PostShortcut from "components/Dashboard/Social/SocialSearch/PostShortcut";
import { VSChat, VSPeople } from "components/icons/village-square";
import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Separator } from "components/ui/separator";
import Image from "next/image";
import { HiBell, HiShare } from "react-icons/hi";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { PiHeartFill } from "react-icons/pi";
import { TbDots } from "react-icons/tb";

const SocialPage = ({ user }: { user: IUser }) => {
  let showDailyLoginReward = false;
  let showHome = true;

  let showSearchMain = false;
  let showAccount = false;
  let showPostsAndHashtags = false;
  let showProfileSearch = false;
  let showNotFoundResult = false;

  return (
    <>
      {showDailyLoginReward && <DailyLoginReward />}
      {showHome && !showAccount && !showPostsAndHashtags && (
        <SocialMainWrapper>
          <div className="flex flex-col gap-y-4 w-full">
            <MessageShortcut user={user} />
            {/* <SocialFlash /> */}
            <SocialPost user={user} />
          </div>
        </SocialMainWrapper>
      )}
      <div className="grid w-full relative">
        {showSearchMain && !showProfileSearch && (
          <>
            <div className="border-b-[1.5px] w-full bg-background fixed px-16 h-fit flex z-40">
              <div className="flex flex-row">
                {/* @Todo Font is bold and primary border when selected */}
                <span className="py-3 px-5 text-lg border-b-4 border-primary font-semibold">
                  Posts
                </span>
                <span className="py-3 px-5 text-lg text-muted-foreground">Hashtags</span>
                <span className="py-3 px-5 text-lg text-muted-foreground">Accounts</span>
              </div>
            </div>
            <div className="px-16 py-6 mt-[55px] min-h-[calc(100vh-150px)] flex flex-col">
              {!showHome && !showAccount && showPostsAndHashtags && <PostShortcut />}

              <div className="grid lg:grid-cols-4 gap-4">
                {!showHome &&
                  showAccount &&
                  !showPostsAndHashtags &&
                  Array.from({ length: 30 }).map((_, index) => (
                    <div className="relative h-[250px] border border-foreground/65 rounded-xl overflow-hidden">
                      <div className="w-full h-full relative rounded-xl overflow-hidden">
                        <div className="absolute h-[33%] w-full top-0 inset-x-0 ">
                          <Image
                            src="/images/beautiful-image.webp"
                            alt="post"
                            className="object-cover"
                            fill
                            quality={90}
                            priority
                          />
                          <CustomAvatar
                            src="/images/beautiful-image.webp"
                            name="John Doe"
                            className="absolute size-20 inset-x-0 mx-auto  rounded-full -bottom-[50%]"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col h-[50%] mt-auto gap-y-2 px-4  py-2 bottom-0 absolute w-full items-center ">
                        <p className="font-medium text-sm">John Doe</p>
                        <p className="text-muted-foreground text-sm">@john_doe</p>
                        <Button className="w-fit px-5 text-foreground">See Profile</Button>
                      </div>
                    </div>
                  ))}
              </div>
              {showNotFoundResult && (
                <NotFoundResult
                  content={
                    <p>
                      Sorry, we couldn't find the result you're <br />
                      searching for.
                    </p>
                  }
                />
              )}
            </div>
          </>
        )}
        {showProfileSearch && !showSearchMain && (
          <div className="px-16 py-6 flex flex-col">
            <div className="w-full rounded-xl h-[25dvh] relative">
              <Image
                src="/images/beautiful-image.webp"
                alt="profile"
                fill
                className="rounded-xl object-cover"
                quality={90}
                priority
              />
              <div className="size-32 absolute rounded-full bg-background/50 backdrop-blur-sm left-12 -bottom-[40%]">
                <div className="size-4 bg-foreground rounded-full absolute flex z-10 bottom-3 right-3  p-[1.7px]">
                  <div className="size-full bg-green-500 rounded-full"></div>
                </div>
                <CustomAvatar
                  src="/images/beautiful-image.webp"
                  name="John Doe"
                  className="size-32 border-2 rounded-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 ml-auto mr-6">
              <Button className="text-foreground rounded-sm">Follow</Button>
              <div className="border h-10 rounded-sm border-primary/65 p-1 px-3 items-center flex gap-x-1.5">
                Share
                <HiShare className="size-4" />
              </div>
              <div className="border h-10 rounded-sm border-primary/65 p-1 items-center flex">
                <HiBell className="size-7" />
              </div>
              <div className="border h-10 rounded-sm border-primary/65 p-1 w-9 items-center flex">
                <VSChat className="size-7 -mt-1 -ml-0.5" />
              </div>
              <TbDots className="size-7" />
            </div>
            <div className="w-full flex flex-col mt-6 pl-[58px] gap-y-3">
              <div className="flex flex-col">
                <div className="flex flex-row gap-x-2 items-center">
                  <span className="font-semibold">Micheal Jordan</span>
                  <HiMiniCheckBadge className="size-5 text-green-600" />
                </div>
                <p className="text-muted-foreground text-sm lowercase">
                  @professional_athlete
                </p>
              </div>
              <p className="leading-6 text-muted-foreground">
                Passionate competitor dedicated to pushing physical and mental limits 🌸,
                competitor dedicated to pushing physical and mental limits Striving for
                excellence on and off the field 🥂🚩.
              </p>
              <div className="flex flex-row justify-between w-[45%]">
                <div className="flex items-start gap-x-1.5">
                  <span className="bg-white/10 backdrop-blur-sm rounded-full p-2 size-10 flex items-center justify-center">
                    <VSPeople className="size-5 -mb-1" />
                  </span>
                  <div>
                    <p className="font-medium">Followers</p>
                    <p className="font-extrabold text-sm">105K</p>
                  </div>
                </div>
                <div className="flex items-center gap-x-1.5">
                  <span className="bg-white/10 backdrop-blur-sm rounded-full p-2 size-10 flex items-center justify-center">
                    <VSPeople className="size-5 -mb-1" />
                  </span>
                  <div>
                    <p className="font-medium">Following</p>
                    <p className="font-extrabold">105K</p>
                  </div>
                </div>
                <div className="flex items-start gap-x-1.5">
                  <span className="bg-white/10 backdrop-blur-sm rounded-full p-2 size-10 flex items-center justify-center">
                    <PiHeartFill className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">Likes</p>
                    <p className="font-extrabold">1,265</p>
                  </div>
                </div>
              </div>
              <Separator className="mb-4" />
              <PostShortcut />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SocialPage;
