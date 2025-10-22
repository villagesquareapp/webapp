import CustomAvatar from "components/ui/custom/custom-avatar";
import { Separator } from "components/ui/separator";
import { IoCameraOutline, IoVideocamOutline } from "react-icons/io5";

const NewSocialField = ({
  user,
  openNewPostDialog,
  addImage,
}: {
  user: IUser;
  openNewPostDialog: () => void;
  addImage: (file: File) => void;
}) => {
  return (
    <div
      className="border rounded-xl flex flex-col cursor-pointer"
      onClick={openNewPostDialog}
    >
      <div className=" p-3 flex gap-x-3 items-center">
        {user?.profile_picture && (
          <CustomAvatar
            src={user?.profile_picture}
            name={user?.name}
            className="size-12 border-foreground border"
          />
        )}
        <p className="text-sm text-muted-foreground">What's on your mind?</p>
      </div>
      <Separator />
      <div className="py-3 px-6 flex gap-x-5 items-center">
        <div className="flex items-center relative gap-x-1 rounded-full bg-black px-3 py-1 text-xs text-muted-foreground">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addImage(file);
            }}
            className="absolute cursor-pointer inset-0 opacity-0"
          />
          <IoCameraOutline className="size-5" />
          Images
        </div>
        <div className="flex items-center relative gap-x-1 rounded-full bg-black px-3 py-1 text-xs text-muted-foreground">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addImage(file);
            }}
            className="absolute cursor-pointer inset-0 opacity-0"
          />
          <IoVideocamOutline className="size-5" />
          Videos
        </div>
      </div>
    </div>
  );
};

export default NewSocialField;
