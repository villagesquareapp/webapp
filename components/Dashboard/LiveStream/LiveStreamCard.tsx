import CustomAvatar from "components/ui/custom/custom-avatar";
import Image from "next/image";
import { CgEyeAlt } from "react-icons/cg";

const LiveStreamCard = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="relative flex flex-col rounded-xl">
        <div className="absolute bg-red-600 font-medium text-xs top-4 left-4 rounded-full px-5 flex py-[5px]">
          Live
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="w-full h-[230px] relative rounded-xl overflow-hidden">
            <Image
              src="/images/beautiful-image.webp"
              alt="post"
              className="object-cover"
              fill
              quality={90}
              priority
            />
          </div>
        </div>
        <div className="absolute flex bottom-0 z-10 w-full h-32 bg-gradient-to-b from-transparent bg-opacity-50 text-foreground  to-background items-end justify-end gap-y-1.5 p-4 flex-col">
          <div className="w-full">
            <p className="font-medium text-sm truncate">
              Exploring new horizons and embrassing the beauty of life
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-x-2">
          <CustomAvatar
            src="/images/beautiful-image.webp"
            className="border-2"
            name="John Doe"
          />
          <div className="flex flex-col">
            <p className="font-medium text-sm">John Doe</p>
            <p className="text-muted-foreground text-xs">@micheal_jord</p>
          </div>
        </div>
        <div>
          <span className="bg-white/10 flex items-center backdrop-blur-sm rounded-full px-3 py-1 space-x-1.5">
            <CgEyeAlt className="size-4" />
            <p className="font-medium text-sm">123</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamCard;
