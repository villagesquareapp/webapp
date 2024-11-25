import CustomAvatar from "components/ui/custom/custom-avatar";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import { AiOutlinePlus } from "react-icons/ai";

const SocialFlash = () => {
  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-4 pb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
          <figure key={index} className="shrink-0">
            <div className="size-fit rounded-full p-1 border-primary border-[3px] relative">
              <div className="size-5 bg-primary text-foreground items-center flex absolute bottom-0.5 z-10 rounded-full place-content-center right-0">
                <AiOutlinePlus />
              </div>
              <CustomAvatar
                src="https://github.com/shadcn.png"
                name="CN"
                className="size-16 border-none"
              />
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground w-20 truncate text-center">
                {/* {'Your Flash'} */}
                John Doe dskjdskkj
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
