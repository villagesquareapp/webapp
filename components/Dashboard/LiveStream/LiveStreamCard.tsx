import CustomAvatar from "components/ui/custom/custom-avatar";
import Image from "next/image";
import { CgEyeAlt } from "react-icons/cg";

interface LiveStreamCardProps {
  title: string;
  coverImage: string;
  username: string;
  name: string;
  profilePicture: string;
  viewerCount: number;
}

const LiveStreamCard = ({title, coverImage, username, name, profilePicture, viewerCount}: LiveStreamCardProps) => {
    const imageSrc = coverImage || "/images/vs-logo.webp";
  const avatarSrc = profilePicture || "/images/default_user.png";
   return (
    <div className="flex flex-col gap-y-2 group">
      {/* Container for the Cover Image and Overlays */}
      <div className="relative flex flex-col rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
        
        {/* Live Tag */}
        <div className="absolute z-20 bg-red-600 font-medium text-xs top-4 left-4 rounded-full px-3 py-1 flex items-center text-white uppercase tracking-wider">
          Live
        </div>
        {/* Viewer Count Badge */}
        
        {/* Video Cover Image */}
        <div className="w-full h-[230px] relative">
          <Image
            src={imageSrc}
            alt={title}
            className="object-cover transition-opacity duration-300 group-hover:opacity-85"
            fill
            sizes="(max-width: 1024px) 100vw, 25vw"
            quality={80}
            priority={false} // Only set priority for images above the fold
          />
        </div>
        
        {/* Title Overlay Gradient (Changed to pull the gradient from the top) */}
        <div className="absolute bottom-0 z-10 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
          <p className="font-semibold text-sm text-white truncate w-full">
            {title}
          </p>
        </div>
      </div>
      
      {/* Host Information (Below the image) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-x-3">
          <CustomAvatar
            src={avatarSrc}
            className="border-2 size-10" // Added size for consistency
            name={username}
          />
          <div className="flex flex-col">
            <p className="font-medium text-sm truncate max-w-[120px]">{name}</p>
            <p className="text-muted-foreground text-xs">@{username}</p>
          </div>
        </div>
        {/* Moved Viewer count badge to the top right overlay for better aesthetics */}
         <div className="z-20 text-white">
          <span className="bg-[#9797978C] flex items-center backdrop-blur-sm rounded-full px-3 py-1 space-x-1.5">
            <CgEyeAlt className="size-4" />
            <p className="font-medium text-sm">{viewerCount.toLocaleString()}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamCard;
