import { CgEyeAlt } from "react-icons/cg";
import Image from "next/image";
import { IoChatbubbleEllipses } from "react-icons/io5";

const PostShortcut = () => {
  return (
    <div className="grid lg:grid-cols-4 gap-4">
      {Array.from({ length: 30 }).map((_, index) => (
        <div key={index} className="relative">
          <div className="flex flex-col gap-y-4">
            <div className="w-full h-[250px]  relative rounded-xl overflow-hidden">
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
            <div className="flex mr-auto items-center gap-x-6">
              <div className="flex items-center gap-x-1.5">
                <span className="bg-white/10 backdrop-blur-sm rounded-full p-1.5">
                  <CgEyeAlt className="size-4" />
                </span>
                <p className="font-medium text-sm">123</p>
              </div>
              <div className="flex items-center gap-x-1.5">
                <span className="bg-white/10 backdrop-blur-sm rounded-full p-1.5">
                  <IoChatbubbleEllipses className="size-4" />
                </span>
                <p className="font-medium text-sm">21.5k</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostShortcut;
