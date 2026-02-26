"use client";

import CustomAvatar from "components/ui/custom/custom-avatar";
import VsCustomLogo from "components/ui/custom/vs-custom-logo";
import { useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { RiSearchLine } from "react-icons/ri";
import Notification from "./Notification";
import { Popover, PopoverTrigger } from "components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { signOut, useSession } from "next-auth/react";
import { Button } from "components/ui/button";
import { SidebarTrigger } from "components/ui/sidebar";

const DashboardNavbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  function getInitials(name: string) {
    return name
      .split(" ")
      .filter(Boolean)
      .map(word => word[0]?.toUpperCase())
      .slice(0, 2)
      .join("")
  }

  return (
    <div className="flex w-full h-16 z-50 bg-background border-b border-white/10 items-center justify-end sticky top-0 shrink-0">
      <div className="flex w-full lg:pr-20 pr-8 items-center h-full">
        <div className="md:hidden ml-4 mr-2 shrink-0">
          <SidebarTrigger />
        </div>

        <div className="flex-1 w-full px-4 lg:px-6 mr-16">
          <div className="relative">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={(e) => {
                if (!e.relatedTarget?.closest(".search-results")) {
                  setIsSearchFocused(false);
                }
              }}
              className="bg-[#1C1C1E] h-10 w-full placeholder:text-muted-foreground pl-12 pr-4 font-medium rounded-full !outline-none !border-none !ring-0 text-sm"
            />
            {searchValue.length > 0 && isSearchFocused && (
              <div className="search-results absolute left-0 top-[52px] w-full bg-background rounded-lg border shadow-lg z-50">
                <div className="w-full h-fit relative p-4" tabIndex={-1}>
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Recent Searches</div>
                    <div className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                      Clear All
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 mt-4">
                    {[1, 2, 3].map((_, index) => (
                      <div
                        key={index}
                        className="w-full text-muted-foreground flex items-center justify-between hover:bg-accent/50 py-2 rounded-md cursor-pointer"
                      >
                        <div className="flex items-center gap-x-2">
                          <RiSearchLine className="size-4" />
                          <p className="text-sm">{`#${index} Search`}</p>
                        </div>
                        <IoClose className="size-4 hover:text-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center ml-auto gap-x-4 pl-2">
          {/* Theme Toggle (Placeholder) */}
          <button className="text-muted-foreground hover:text-foreground hidden sm:block">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>

          <div className="relative">
            <Notification />
            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border border-background"></div>
          </div>

          {/* Wallet Icon */}
          <button className="text-muted-foreground hover:text-foreground hidden sm:block">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
            </svg>
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-x-2 cursor-pointer">
                <CustomAvatar
                  src={user?.profile_picture || ""}
                  name={getInitials(user?.name || "User")}
                  className="size-9 md:size-10"
                />
                <div className="hidden lg:flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold uppercase">{user?.name || "User"}</span>
                  <span className="text-xs text-muted-foreground">@{user?.username || "username"}</span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-40" align="end">
              <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: "/auth/login" })}>
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
