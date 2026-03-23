"use client";

import CustomAvatar from "components/ui/custom/custom-avatar";
import Link from "next/link";
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
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const DashboardNavbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, setTheme } = useTheme();

  function getInitials(name: string) {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  }

  return (
    <div className="relative flex h-16 z-50 bg-background items-center justify-center top-0 shrink-0 after:fixed after:top-16 after:left-0 after:right-0 after:border-b after:border-border pointer-events-none after:pointer-events-none">
      <div className="flex w-full items-center h-full pointer-events-auto">
        <div className="md:hidden mr-4 shrink-0 pl-4">
          <SidebarTrigger />
        </div>

        <div
          className={
            pathname.includes("/vflix")
              ? "w-[565px] ml-[268px] mr-[63px]"
              : "w-[650px] px-4 lg:px-6"
          }
        >
          <div className="relative w-full">
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
              className="bg-accent h-10 w-full placeholder:text-muted-foreground pl-12 pr-4 font-medium rounded-full !outline-none !border-none !ring-0 text-sm text-foreground"
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
        {/* Right hand side Navbar */}
        <div
          className={
            pathname.includes("/vflix")
              ? "flex-1 flex items-center justify-end gap-x-4 pr-4 lg:pr-16"
              : "w-[400px] flex items-center justify-end gap-x-4 px-4 lg:px-6"
          }
        >
          {/* Theme Toggle */}
          <button
            className="text-muted-foreground hover:text-foreground hidden sm:block transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "light" ? (
              <Moon className="size-5" />
            ) : (
              <Sun className="size-[22px]" />
            )}
          </button>

          <div className="relative">
            <Notification />
          </div>

          {/* Wallet Icon */}
          {/* <button className="text-muted-foreground hover:text-foreground hidden sm:block">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
            </svg>
          </button> */}

          {/* Profile */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-x-2 cursor-pointer">
                <CustomAvatar
                  src={user?.profile_picture || ""}
                  name={getInitials(user?.name || "")}
                  className="size-9 md:size-10"
                />
                <div className="hidden lg:flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold uppercase">
                    {user?.name.split(" ")[0]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{user?.username || ""}
                  </span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2" align="end">
              <div className="flex flex-col gap-1 w-full">
                <Link href={`/user/${user?.username || ""}`}>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9">
                    View Profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full h-9"
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
