import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import VsCustomLogo from "components/ui/custom/vs-custom-logo";
import { FaBell } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

const DashboardNavbar = () => {
  const userProfileImage = "https://github.com/shadcn.png";
  const notificationsCount = 3;

  return (
    <div className="flex fixed w-full h-16 z-50 border-b bg-background">
      <div className="w-[280px] flex items-center pl-8">
        <VsCustomLogo />
      </div>
      <div className="flex-1 flex">
        <div className="w-[800px] mx-auto flex items-center">
          <div className="w-[500px] ml-[126px] relative">
            <input
              type="search"
              placeholder="Search"
              className="bg-accent h-10 w-full placeholder:text-foreground pl-4 pr-12 font-medium rounded-lg"
            />
            <IoSearch className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-foreground pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="w-[280px] flex items-center justify-end gap-x-4 pr-8">
        <div className="relative">
          <div className="bg-red-500 text-xs h-6 w-6 absolute -top-1 right-0 rounded-full flex items-center justify-center text-foreground">
            {notificationsCount}
          </div>
          <FaBell className="text-foreground size-8" />
        </div>
        <Avatar className="size-11 border-foreground border-2">
          <AvatarImage src={userProfileImage} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardNavbar;
