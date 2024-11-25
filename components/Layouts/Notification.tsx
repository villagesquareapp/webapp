import { useState } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Separator } from "components/ui/separator";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

const Notification = () => {
  const [open, setOpen] = useState(false);
  const notificationsCount = 3;

  let followedNotification = true;
  let commentNotification = false;
  let likeNotification = false;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="relative">
          <div className="bg-red-500 text-xs h-6 w-6 absolute -top-1 right-0 rounded-full flex items-center justify-center text-foreground">
            {notificationsCount}
          </div>
          <FaBell className="text-foreground size-8" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" side="left" align="start" sideOffset={10}>
        {/* Fixed header */}
        <div className="px-4 py-2 flex items-center justify-between sticky top-0 bg-background">
          <p className="font-semibold">Notifications</p>
          <IoIosClose
            className="size-8 cursor-pointer hover:text-muted-foreground"
            onClick={() => setOpen(false)}
          />
        </div>
        <Separator className="w-full" />

        {/* Scrollable content */}
        <div className="max-h-[400px] overflow-y-auto">
          {/* Today's notifications */}
          <div className="px-4 py-2">
            <p className="text-sm font-medium">Today</p>
          </div>
          <div className="flex flex-col gap-y-2">
            {/* Notification item */}
            <div className="px-4 py-2 hover:bg-muted/50">
              <div className="flex flex-row items-center gap-x-3">
                <CustomAvatar
                  src={"/images/beautiful-image.webp"}
                  name="CN"
                  className="size-9"
                />
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium">John Doe </span>
                    <span className="text-muted-foreground">has followed you</span>
                  </div>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
                <div className="size-12 relative rounded-md overflow-hidden">
                  <Image
                    src={"/images/beautiful-image.webp"}
                    alt="beautiful-image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <Separator className="w-full" />

            {/* Yesterday's notifications */}
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-muted-foreground">Yesterday</p>
            </div>
            <div className="px-4 py-1 hover:bg-muted/50">
              <div className="flex flex-row items-center gap-x-3">
                <CustomAvatar
                  src={"/images/beautiful-image.webp"}
                  name="CN"
                  className="size-9"
                />
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium">Jane Smith </span>
                    <span className="text-muted-foreground">liked your post</span>
                  </div>
                  <span className="text-xs text-muted-foreground">1d ago</span>
                </div>
                <div className="size-12 relative rounded-md overflow-hidden">
                  <Image
                    src={"/images/beautiful-image.webp"}
                    alt="beautiful-image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <Separator className="w-full" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
