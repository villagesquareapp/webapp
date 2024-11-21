import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Button } from "components/ui/button";
import VsCustomLogo from "components/ui/custom/vs-custom-logo";
import { Separator } from "components/ui/separator";
import { SidebarProvider } from "components/ui/sidebar";
import Image from "next/image";
import React from "react";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { AppSidebar } from "./AppSidebar";
import DashboardNavbar from "./DashboardNavbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="md:hidden lg:flex relative font-albert-sans">
      <DashboardNavbar />
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <div className="flex flex-row justify-between w-[800px] mx-auto h-full pt-20">
            <div className="flex w-[500px] rounded-lg pb-8">{children}</div>
            <div className="flex flex-col gap-8">
              <div className="flex w-[280px] h-[150px]">
                <div className="flex w-full flex-col gap-8">
                  <div className="w-full flex relative h-[140px] border rounded-xl">
                    <div className="inset-0 bg-gradient-to-t via-black from-black to-transparent opacity-50 z-20 absolute"></div>
                    <Image
                      src="/images/beautiful-image.jpg"
                      alt="logo"
                      fill
                      className="rounded-lg w-full h-full object-cover"
                    />
                    <div className="absolute bg-white opacity-50 rounded-lg items-center place-content-center flex w-9 h-9 right-3 top-3">
                      <FaExternalLinkSquareAlt className="size-6 text-muted-foreground" />
                    </div>
                    <p className="z-30 text-sm w-full absolute bottom-10 font-medium inset-x-0 ml-4">
                      Make Your Business Profit
                    </p>
                    <div className="px-5 py-1.5 bg-muted-foreground w-fit rounded-full text-foreground !z-30 absolute -bottom-4 font-medium inset-x-0 ml-4 flex text-xs">
                      Sponsored By Wix Studio
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full gap-y-3 h-fit border rounded-xl flex flex-col">
                <p className="px-3 pt-4 pb-2 font-semibold">People Suggestions</p>
                <Separator />
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index}>
                    <div className="flex items-center flex-row px-3 justify-between">
                      <div className="flex items-center gap-x-3 w-40">
                        <Avatar className="size-12 border-foreground border-2 ">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p className="truncate text-sm">bJoh dinsdhbdjdsbhfjs</p>
                      </div>
                      <Button className="text-foreground">Follow</Button>
                    </div>
                    <Separator className="my-3" />
                  </div>
                ))}
                <Button
                  className="text-center mx-auto -mt-2 mb-2 text-muted-foreground"
                  variant={"ghost"}
                >
                  View More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
};

export default DashboardLayout;
