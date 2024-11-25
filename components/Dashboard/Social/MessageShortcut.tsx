"use client";

import CustomAvatar from "components/ui/custom/custom-avatar";
import { Separator } from "components/ui/separator";
import { cn } from "lib/utils";
import { useState } from "react";
import { HiMiniChevronUp } from "react-icons/hi2";
import Chat from "./Chat";

const MessageCount = ({ count, className }: { count: number; className?: string }) => {
  return (
    <div
      className={cn(
        `flex items-center justify-center bg-red-500 text-xs rounded-full size-5 font-bold`,
        className
      )}
    >
      {count}
    </div>
  );
};

const MessageShortcut = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showMessages, setShowMessages] = useState(false);

  const removeSelectedChat = () => {
    setSelectedChat(null);
  };

  return (
    <>
      {selectedChat && <Chat removeSelectedChat={removeSelectedChat} />}
      <div className="fixed bottom-0 z-50 flex flex-col border rounded-t-2xl right-4 w-[320px] bg-background shadow-md">
        <div
          onClick={() => setShowMessages(!showMessages)}
          className="flex items-center justify-between py-2 px-3 cursor-pointer"
        >
          <div className="flex flex-row items-center gap-x-2">
            <CustomAvatar
              src="https://github.com/shadcn.png"
              name="CN"
              className="size-8 border-foreground border"
            />
            <p className="font-medium text-sm">Messages</p>
          </div>
          <div className="flex flex-row items-center gap-x-2">
            {!showMessages && <MessageCount count={3} />}
            <HiMiniChevronUp
              className={`size-6 transition-all duration-500 ${
                showMessages ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            showMessages ? "max-h-[430px]" : "max-h-0"
          }`}
        >
          <Separator className="mt-2" />
          <div>
            <div className="flex flex-col gap-y-2 ">
              <div className="py-2 px-3">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full text-sm !ring-0 !outline-none border border-primary py-1.5 px-3 rounded-md bg-background"
                />
              </div>
              <div className="flex flex-col max-h-[380px] pb-10 overflow-y-auto scrollbar-hide">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                  <div
                    key={item}
                    onClick={() => setSelectedChat(item.toString())}
                    className="cursor-pointer"
                  >
                    <div className="flex gap-x-2 px-3 py-4 flex-row items-center w-full">
                      <CustomAvatar
                        src="https://github.com/shadcn.png"
                        name="CN"
                        className="size-11 border-foreground border-[1.5px]"
                      />
                      <div className="flex flex-row items-center gap-x-2 justify-between w-full">
                        <div className="flex flex-col gap-y-1 justify-between ">
                          <p className="text-sm font-medium truncate w-40">Micheal Jordan</p>
                          <p className="text-xs truncate w-40 text-muted-foreground">
                            Hii whats up bro?
                          </p>
                        </div>
                        <div className="flex flex-col w-fit place-items-center gap-y-1 justify-between">
                          <MessageCount count={1} />
                          <p className="text-xs text-muted-foreground">12:00am</p>
                        </div>
                      </div>
                    </div>
                    <Separator className="m-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageShortcut;
