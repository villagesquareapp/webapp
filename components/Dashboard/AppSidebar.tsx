"use client";

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
import { FaEnvelope, FaUser } from "react-icons/fa";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineVideoCamera, HiVideoCamera } from "react-icons/hi";
import { IoPersonOutline, IoPersonSharp } from "react-icons/io5";
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
    url: "#",
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

export function AppSidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <Sidebar className="w-[280px] ">
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

                return (
                  <SidebarMenuItem key={item.title} className="px-2">
                    <SidebarMenuButton
                      asChild
                      className="text-foreground"
                      onMouseEnter={() => setHoveredItem(item.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Link href={item.url}>
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
