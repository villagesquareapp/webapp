"use client";

import CustomAvatar from "components/ui/custom/custom-avatar";
import VsCustomLogo from "components/ui/custom/vs-custom-logo";
import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { IoClose, IoSearch } from "react-icons/io5";
import { RiSearchLine } from "react-icons/ri";
import Notification from "./Notification";

const DashboardNavbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const userProfileImage = "https://github.com/shadcn.png";
  const notificationsCount = 3;

  return (
    <div className="flex fixed w-full h-16 z-50 border-b bg-background">
      <div className="w-[280px] flex items-center pl-8">
        <VsCustomLogo />
      </div>
      <div className="flex-1 flex">
        <div className="w-[800px] mx-auto flex items-center">
          <div className="w-[500px] ml-[140px] relative">
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
              className="bg-accent h-10 w-full placeholder:text-foreground pl-4 pr-12 font-medium rounded-lg !outline-none !border-none !ring-0"
            />
            <IoSearch className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-foreground pointer-events-none" />
            {searchValue.length > 0 && isSearchFocused && (
              <div className="search-results absolute left-0 top-[52px] w-[500px] bg-background rounded-lg border shadow-lg">
                <div className="w-full h-fit relative p-4" tabIndex={-1}>
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">Recent Searches</div>
                    <div className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                      Clear All
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 mt-4">
                    {[1, 2, 3, 4, 5].map((_, index) => (
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
      </div>

      <div className="w-[280px] flex items-center justify-end gap-x-4 pr-8">
        <Notification />
        <CustomAvatar
          src={userProfileImage}
          name="CN"
          className="size-11 border-foreground border-2"
        />
      </div>
    </div>
  );
};

export default DashboardNavbar;
