"use client";

import {
  VFlixFill,
  VFlixOutline,
  VSCameraFill,
  VSMailFill,
} from "components/icons/village-square";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsMic, BsMicFill } from "react-icons/bs";
import { FaHeart, FaShoppingBasket, FaUsers } from "react-icons/fa";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { MdMailOutline } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { AiFillShopping } from "react-icons/ai";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlinePublic } from "react-icons/md";
import VsCustomLogo from "components/ui/custom/vs-custom-logo";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { useAddPost } from "context/AddPostContext";
import { useVFlixUpload } from "context/VFlixUploadContext";
import { useSidebar } from "components/ui/sidebar";
import React from "react";

const items = [
  {
    title: "Social",
    url: "/home",
    icon: <GoHome className="!size-6 -ml-0.5" />,
    activeIcon: <GoHomeFill className="fill-background text-background !size-6 -mt-0.5" />,
  },
  {
    title: "Vflix",
    url: "/vflix",
    icon: <VFlixOutline className="!size-6" />,
    activeIcon: <VFlixFill className="fill-background text-background !size-6 " />,
  },
  // {
  //   title: "Messages",
  //   url: "/dashboard/messages",
  //   icon: <MdMailOutline className="!size-6" />,
  //   activeIcon: <VSMailFill className="fill-black !size-6" />,
  // },
  // {
  //   title: "Dating hub",
  //   url: "#",
  //   icon: <FaHeart className="!size-5 ml-0.5" />,
  //   activeIcon: <FaHeartCircleCheck className="fill-black !size-5 ml-0.5" />,
  // },
  // {
  //   title: "Echo",
  //   url: "#",
  //   icon: <BsMic className="!size-5 ml-0.5" />,
  //   activeIcon: <BsMicFill className="fill-black !size-5 ml-0.5" />,
  // },
  // {
  //   title: "Livestream",
  //   url: "/dashboard/live-streams",
  //   icon: <HiOutlineVideoCamera className="!size-6" />,
  //   activeIcon: <VSCameraFill className="fill-black !size-6" />,
  // },
  // {
  //   title: "Marketsquare",
  //   url: "#",
  //   icon: <FaShoppingBasket className="!size-5 ml-0.5" />,
  //   activeIcon: <AiFillShopping className="fill-black !size-5 ml-0.5" />,
  // },
  // {
  //   title: "Tribes",
  //   url: "#",
  //   icon: <FaUsers className="!size-5 ml-0.5" />,
  //   activeIcon: <FaUserGroup className="fill-black !size-5 ml-0.5" />,
  // },
  // {
  //   title: "ATC",
  //   url: "#",
  //   icon: <BiWorld className="!size-5 ml-0.5" />,
  //   activeIcon: <MdOutlinePublic className="fill-black !size-5 ml-0.5" />,
  // },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { openAddPost } = useAddPost();
  const { openVFlixUpload } = useVFlixUpload();
  const { setOpen, state } = useSidebar();

  React.useEffect(() => {
    if (pathname.includes("/vflix")) {
      setOpen(false);
    } else if (pathname.includes("/home")) {
      setOpen(true);
    }
  }, [pathname, setOpen]);

  const isCollapsed = state === "collapsed";

  const handleCreatePost = () => {
    if (pathname.includes("/vflix")) {
      openVFlixUpload();
    } else {
      openAddPost();
    }
  };

  return (
    <Sidebar className="border-r border-border shadow-none bg-background pl-8" collapsible="icon" mobileVariant="sheet">
      <SidebarHeader className="pt-6 pb-4 border-none bg-background">
        <VsCustomLogo />
      </SidebarHeader>

      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupContent className="pt-4 px-3">
            <SidebarMenu className="flex flex-col gap-y-2">
              {items.map((item) => {
                const isActive = pathname.includes(item.url) && item.url !== "#";
                const Icon: any = isActive ? item.activeIcon : item.icon;

                return (
                  <SidebarMenuItem key={item.title} className="px-2.5">
                    <SidebarMenuButton
                      asChild
                      className={`rounded-lg transition-all duration-300 cursor-pointer w-full h-12 ${isActive
                        ? "bg-[#31373f] text-background hover:bg-[#1717190D] dark:bg-foreground dark:text-background dark:hover:bg-foreground dark:hover:text-background"
                        : "text-muted-foreground"
                        }`}
                    >
                      <Link href={item.url} prefetch={true} className="flex items-center p-3 gap-x-4">
                        <span className="shrink-0 flex items-center justify-center">{Icon}</span>
                        {!isCollapsed && <span className="font-semibold text-base whitespace-nowrap">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-background pb-8 pl-[1.375rem] pr-6">
        {isCollapsed ? (
          <Button
            onClick={handleCreatePost}
            className="size-12 rounded-full bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white flex items-center justify-center p-0 shrink-0"
          >
            <Plus className="size-5 text-white shrink-0" />
          </Button>
        ) : (
          // <Button
          //   onClick={handleCreatePost}
          //   className="w-full h-12 rounded-full bg-[#094DB5BF] hover:bg-[#0D52D2]/90 text-white font-medium flex items-center justify-center gap-2"
          // >
          //   New Post
          // </Button>

          <Button
            onClick={handleCreatePost}
            className="w-full h-12 rounded-full bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white font-medium flex items-center justify-center gap-2"
          >
            New Post
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}