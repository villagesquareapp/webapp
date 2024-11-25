import Image from "next/image";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const SponsorCard = ({ sponsorType }: { sponsorType: "liveStream" | "social" }) => {
  return (
    <div className={`flex h-[150px] ${sponsorType === "liveStream" ? "w-full" : "w-[280px]"}`}>
      <div className="flex w-full flex-col gap-8">
        <div className="w-full flex relative h-[140px] border rounded-xl">
          <div className="inset-0 bg-gradient-to-t via-black from-black to-transparent opacity-50 z-20 absolute"></div>
          <Image
            src="/images/beautiful-image.webp"
            alt="logo"
            fill
            className="rounded-lg w-full h-full object-cover"
          />
          <div className="flex gap-x-2 right-3 top-3 absolute">
            <div className="bg-white opacity-50  rounded-md items-center place-content-center flex size-7">
              <FaExternalLinkSquareAlt className="size-5 text-muted-foreground" />
            </div>
            {sponsorType === "liveStream" && (
              <div className="bg-white opacity-50  rounded-md items-center place-content-center flex size-7">
                <IoClose className="size-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <p className="z-30 text-sm w-full absolute bottom-10 font-medium inset-x-0 ml-4">
            Make Your Business Profit
          </p>
          <div
            className={`px-5 py-1.5 bg-muted-foreground w-fit rounded-full text-foreground !z-30 absolute font-medium inset-x-0 ml-4 flex text-xs ${
              sponsorType === "social" ? "-bottom-4" : "bottom-2"
            }`}
          >
            Sponsored By Wix Studio
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorCard;
