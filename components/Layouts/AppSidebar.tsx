"use client";

import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import {
  VFlixFill,
  VFlixOutline,
  VSCameraFill,
  VSMailFill,
  VSMore,
  VSWalletFill,
  VSWalletOutline,
} from "components/icons/village-square";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BsBriefcase, BsCalendar, BsMic } from "react-icons/bs";
import { FaComments, FaHeart, FaShoppingBasket, FaUsers } from "react-icons/fa";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { IoChatbubbleEllipsesOutline, IoPersonOutline, IoPersonSharp } from "react-icons/io5";
import { MdMailOutline } from "react-icons/md";

const items = [
  {
    title: "Social",
    url: "/dashboard/social",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    title: "Vflix",
    url: "#",
    icon: VFlixOutline,
    activeIcon: VFlixFill,
  },
  {
    title: "Live Streams",
    url: "/dashboard/live-streams",
    icon: HiOutlineVideoCamera,
    activeIcon: VSCameraFill,
  },
  {
    title: "Messages",
    url: "#",
    icon: MdMailOutline,
    activeIcon: VSMailFill,
  },
  {
    title: "Wallet",
    url: "/dashboard/wallet",
    icon: VSWalletOutline,
    activeIcon: VSWalletFill,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: IoPersonOutline,
    activeIcon: IoPersonSharp,
  },
  {
    title: "More Pages",
    url: "#",
    icon: VSMore,
  },
];

const morePageItems = [
  { title: "Dating", icon: FaHeart, url: "#" },
  { title: "Marketplace", icon: FaShoppingBasket, url: "#" },
  { title: "Audio Hub", icon: BsMic, url: "#" },
  { title: "Forums", icon: FaComments, url: "#" },
  { title: "Event", icon: BsCalendar, url: "#" },
  { title: "Chat", icon: IoChatbubbleEllipsesOutline, url: "#" },
  { title: "Search Users", icon: FaUsers, url: "#" },
  { title: "Jobs", icon: BsBriefcase, url: "#" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <Sidebar className="w-[280px] bg-yellow-500">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupContent className="pt-20 px-5 ">
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                const isHovered = hoveredItem === item.title;
                const Icon: any =
                  item.title === "Social" && (isActive || isHovered)
                    ? item.activeIcon
                    : item.icon;

                if (item.title === "More Pages") {
                  return (
                    <SidebarMenuItem key={item.title} className="px-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <SidebarMenuButton
                            className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                              isActive || isHovered
                                ? "bg-foreground text-background"
                                : "text-foreground"
                            }`}
                            onMouseEnter={() => setHoveredItem(item.title)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <Icon className="size-6" />
                            <span className="font-semibold">{item.title}</span>
                          </SidebarMenuButton>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2" side="bottom">
                          <div className="flex flex-col space-y-1">
                            {morePageItems.map((moreItem) => (
                              <Link
                                key={moreItem.title}
                                href={moreItem.url}
                                className="flex flex-row  items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                              >
                                <moreItem.icon className="size-5" />
                                <span>{moreItem.title}</span>
                              </Link>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title} className="px-2">
                    <SidebarMenuButton
                      asChild
                      className={`w-full rounded-md transition-colors ${
                        isActive || isHovered
                          ? "bg-foreground text-background"
                          : "text-foreground"
                      }`}
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Link href={item.url} className="flex items-center px-3 py-2">
                        <Icon className="size-6" />
                        <span className="font-semibold">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
