import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Separator } from "components/ui/separator";
import { IoCameraOutline, IoVideocamOutline } from "react-icons/io5";

const NewSocialField = () => {
  return (
    <div className="border rounded-xl flex flex-col">
      <div className=" p-3 flex gap-x-3 items-center">
        <Avatar className="size-12 border-foreground border ">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">Write something here...</p>
      </div>
      <Separator />
      <div className="py-3 px-6 flex gap-x-7 items-center">
        <div className="flex items-center gap-x-1 rounded-full bg-black px-3 py-1 text-xs text-muted-foreground">
          <IoCameraOutline className="size-5" />
          Images
        </div>
        <div className="flex items-center gap-x-1 rounded-full bg-black px-3 py-1 text-xs text-muted-foreground">
          <IoVideocamOutline className="size-5" />
          Videos
        </div>
      </div>
    </div>
  );
};

export default NewSocialField;
