import CustomAvatar from "components/ui/custom/custom-avatar";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import { AiOutlinePlus } from "react-icons/ai";

const SocialFlash = () => {
  return (
    <ScrollArea className="w-full pt-2">
      <div className="flex space-x-4 pb-4">
        {/* Current User Flash Action */}
        <figure className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center">
          <div className="size-fit rounded-[24px] p-0.5 relative shadow-md shadow-primary/10 bg-background border-2 border-dashed border-primary/60">
            <div className="bg-background rounded-[22px] p-1">
              <div className="size-6 bg-primary text-primary-foreground items-center flex absolute -bottom-1 -right-1 z-10 rounded-full place-content-center shadow-sm shadow-black/50">
                <AiOutlinePlus />
              </div>
              <CustomAvatar
                src=""
                name="My Flash"
                className="size-[64px] sm:size-[72px] rounded-[18px] object-cover"
              />
            </div>
          </div>
          <figcaption className="pt-2 text-xs text-muted-foreground mt-1">
            <p className="font-semibold text-foreground w-full truncate text-center">
              Your Flash
            </p>
          </figcaption>
        </figure>

        {/* Other Users' Flashes */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
          <figure key={index} className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center">
            <div className="size-fit rounded-[24px] p-[2.5px] bg-gradient-to-tr from-primary to-blue-400 relative shadow-md shadow-primary/20">
              <div className="bg-background rounded-[22px] p-0.5">
                <CustomAvatar
                  src="https://github.com/shadcn.png"
                  name="CN"
                  className="size-[64px] sm:size-[72px] rounded-[20px] object-cover"
                />
              </div>
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground mt-1">
              <p className="font-medium text-foreground w-[72px] truncate text-center">
                User {index + 1}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
};

export default SocialFlash;
