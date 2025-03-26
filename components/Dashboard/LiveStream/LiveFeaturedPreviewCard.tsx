import CustomAvatar from "components/ui/custom/custom-avatar";
import ReactPlayer from "react-player";
import { CgEyeAlt } from "react-icons/cg";

const LiveFeaturedPreviewCard = ({
  featuredLivestreamData,
}: {
  featuredLivestreamData: IFeaturedLivestream;
}) => {
  const hlsUrl = featuredLivestreamData?.livestream_room_stream_url;

  console.log("HLS URL", hlsUrl);

  return (
    <div className="relative bg-muted flex flex-col rounded-xl">
      <span className="bg-white/10 flex absolute top-2 left-2 items-center backdrop-blur-sm rounded-full px-2 py-1 space-x-1">
        <CgEyeAlt className="size-4" />
        <p className="font-medium text-xs">123</p>
      </span>
      <div className="flex flex-col gap-y-4">
        <div className="w-full h-[280px] relative rounded-xl overflow-hidden">
          <ReactPlayer
            url={hlsUrl}
            width="100%"
            height="100%"
            playing
            loop
            muted
            playsinline
            controls={false}
            config={{
              file: {
                attributes: {
                  style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  },
                },
              },
            }}
          />
        </div>
      </div>
      <div className="absolute flex bottom-0 z-10 w-full h-32 bg-gradient-to-b from-transparent bg-opacity-50 text-foreground  to-background items-end justify-end gap-y-1.5 p-2 py-3 flex-col">
        <div className="w-full">
          <p className="font-medium text-sm truncate">
            Exploring new horizons and embrassing the beauty of life
          </p>
        </div>
        <div className="flex items-center w-full">
          <div className="flex items-center gap-x-2 w-full">
            <div className="relative shrink-0">
              <CustomAvatar
                src={featuredLivestreamData?.host?.profile_picture}
                className="border-2 size-12"
                name="John Doe"
              />
              <div className="absolute bg-red-600 font-medium text-[11px] -bottom-1 inset-x-0 mx-auto rounded-full px-1 w-10 flex py-[1px] place-content-center z-20">
                Live
              </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="font-medium text-sm truncate">
                {featuredLivestreamData?.host?.name}
              </p>
              <p className="text-muted-foreground text-xs truncate">
                @{featuredLivestreamData?.host?.username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFeaturedPreviewCard;
