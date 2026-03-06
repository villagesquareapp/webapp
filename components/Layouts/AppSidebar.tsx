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
import { useSidebar } from "components/ui/sidebar";
import React from "react";

const items = [
  {
    title: "Social",
    url: "/dashboard/social",
    icon: <GoHome className="!size-6 -ml-0.5" />,
    activeIcon: <GoHomeFill className="fill-black !size-6 -mt-0.5" />,
  },
  {
    title: "Vflix",
    url: "/dashboard/vflix",
    icon: <VFlixOutline className="!size-6" />,
    activeIcon: <VFlixFill className="fill-black !size-6 " />,
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
  {
    title: "Livestream",
    url: "/dashboard/live-streams",
    icon: <HiOutlineVideoCamera className="!size-6" />,
    activeIcon: <VSCameraFill className="fill-black !size-6" />,
  },
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
  const { setOpen, state } = useSidebar();

  React.useEffect(() => {
    if (pathname.includes("/dashboard/vflix")) {
      setOpen(false);
    } else if (pathname.includes("/dashboard/social")) {
      setOpen(true);
    }
  }, [pathname, setOpen]);

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={`border-r border-white/5 shadow-none bg-background ${isCollapsed ? '' : 'pl-8'}`} collapsible="icon" mobileVariant="sheet">
      <SidebarHeader className={`pt-6 pb-4 border-none bg-background ${isCollapsed ? 'flex items-center justify-center' : ''}`}>
        <VsCustomLogo />
      </SidebarHeader>

      <SidebarContent className={`bg-background ${isCollapsed ? 'flex items-center' : ''}`}>
        <SidebarGroup>
          <SidebarGroupContent className={`${isCollapsed ? 'px-0' : 'px-3'}`}>
            <SidebarMenu className="flex flex-col gap-y-2">
              {items.map((item) => {
                const isActive = pathname.includes(item.url) && item.url !== "#";
                const Icon: any = isActive ? item.activeIcon : item.icon;

                return (
                  <SidebarMenuItem key={item.title} className={isCollapsed ? 'px-0 py-2 flex items-center justify-center' : 'px-2'}>
                    <SidebarMenuButton
                      asChild
                      className={`rounded-lg transition-colors h-12 ${isCollapsed ? '!size-12 !p-0 flex items-center justify-center mx-auto' : 'w-full'} ${isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                        }`}
                    >
                      <Link href={item.url} prefetch={false} className={`flex items-center ${isCollapsed ? 'justify-center w-full h-full' : 'p-3 gap-x-4'}`}>
                        <span className="shrink-0 flex items-center justify-center">{Icon}</span>
                        {!isCollapsed && <span className="font-semibold text-base">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`bg-background pb-8 ${isCollapsed ? 'px-0 pb-12 flex justify-center items-center' : 'px-6'}`}>
        {isCollapsed ? (
          <Button
            onClick={openAddPost}
            className="size-[52px] rounded-full bg-[#094DB5] hover:bg-[#0D52D2]/90 text-white flex items-center justify-center p-0 shrink-0"
          >
            <Plus className="size-7" strokeWidth={2.5} />
          </Button>
        ) : (
          <Button
            onClick={openAddPost}
            className="w-full h-12 rounded-full bg-[#094DB5BF] hover:bg-[#0D52D2]/90 text-white font-medium flex items-center gap-2"
          >
            {/* <Plus className="size-5" /> */}
            New Post
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}