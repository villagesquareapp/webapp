"use client";

import CustomAvatar from "components/ui/custom/custom-avatar";
import Link from "next/link";
import VsCustomLogo from "components/ui/custom/vs-custom-logo";
import { useState, useRef } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { RiSearchLine } from "react-icons/ri";
import Notification from "./Notification";
import { Popover, PopoverTrigger } from "components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { signOut, useSession } from "next-auth/react";
import { Button } from "components/ui/button";
import { SidebarTrigger } from "components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useGuest } from "context/GuestContext";

const DashboardNavbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { theme, setTheme } = useTheme();
  const { isGuest } = useGuest();
  const router = useRouter();

  // Hide search bar for guests on vflix pages (video takes full focus)
  const hideSearch = isGuest && pathname.startsWith("/vflix/");

  // Fetch recent searches on focus
  const fetchRecent = async () => {
    try {
      const res = await fetch("/api/search/recent");
      const data = await res.json();
      if (data?.status && data?.data) {
        setRecentSearches(Array.isArray(data.data) ? data.data : []);
      }
    } catch { }
  };

  // Debounced autocomplete
  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setAutocompleteResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingAutocomplete(true);
      try {
        const res = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        if (data?.status && data?.data) {
          setAutocompleteResults(Array.isArray(data.data) ? data.data : []);
        } else {
          setAutocompleteResults([]);
        }
      } catch {
        setAutocompleteResults([]);
      } finally {
        setLoadingAutocomplete(false);
      }
    }, 300);
  };

  // Navigate to search results page
  const executeSearch = (q?: string) => {
    const query = q || searchValue.trim();
    if (!query) return;
    setIsSearchFocused(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    }
  };

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

        {/* Center Search Bar — hidden for guests on vflix pages */}
        {!hideSearch && (
        <div
          className={
            pathname === "/vflix" || pathname.startsWith("/vflix/")
              ? "flex-1 max-w-[35rem] lg:ml-[17rem] lg:mr-[4rem] mx-4"
              : pathname.startsWith("/messages")
                ? "w-[340px] shrink-0 px-4"
                : pathname.startsWith("/settings")
                  ? "w-full max-w-[20rem] lg:max-w-[31.25rem] pl-4 pr-6"
                  : "flex-1 lg:max-w-[64rem] px-4 lg:px-6"
          }
        >
          <div className="relative w-full">
            <IoSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground cursor-pointer z-10"
              onClick={() => executeSearch()}
            />
            {searchValue && (
              <button
                onClick={() => { setSearchValue(""); setAutocompleteResults([]); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground hover:text-foreground z-10"
              >
                <IoClose className="size-4" />
              </button>
            )}
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => { setIsSearchFocused(true); fetchRecent(); }}
              onBlur={(e) => {
                if (!e.relatedTarget?.closest(".search-dropdown")) {
                  setTimeout(() => setIsSearchFocused(false), 150);
                }
              }}
              onKeyDown={handleSearchKeyDown}
              className="bg-[#1717191A] dark:bg-[#232325] h-10 w-full placeholder:text-muted-foreground pl-12 pr-10 font-medium rounded-full !outline-none !border-none !ring-0 text-sm text-foreground"
            />

            {/* Search dropdown */}
            {isSearchFocused && !isGuest && (
              <div className="search-dropdown absolute left-0 top-[52px] w-full bg-background rounded-xl border border-border shadow-xl z-50 max-h-[400px] overflow-y-auto no-scrollbar" tabIndex={-1}>
                {/* Autocomplete results */}
                {searchValue.trim() && (
                  <div className="p-3">
                    {loadingAutocomplete && (
                      <p className="text-xs text-muted-foreground text-center py-3">Searching...</p>
                    )}
                    {!loadingAutocomplete && autocompleteResults.length > 0 && (
                      <div className="flex flex-col">
                        {autocompleteResults.map((item: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => executeSearch(item.text || item.query || item)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left w-full"
                          >
                            <RiSearchLine className="size-4 text-muted-foreground shrink-0" />
                            <span className="text-sm text-foreground truncate">
                              {typeof item === "string" ? item : item.text || item.query || item.name || ""}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {!loadingAutocomplete && autocompleteResults.length === 0 && searchValue.trim().length > 1 && (
                      <p className="text-xs text-muted-foreground text-center py-3">No suggestions found</p>
                    )}
                  </div>
                )}

                {/* Recent searches — shown when input is empty */}
                {!searchValue.trim() && (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Recent
                      </p>
                      {recentSearches.length > 0 && (
                        <button
                          onClick={() => {
                            setRecentSearches([]);
                            fetch("/api/search/recent/clear-all", { method: "DELETE" });
                          }}
                          className="text-xs text-[#0D52D2] hover:underline font-medium"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    {recentSearches.length > 0 ? (
                      <div className="flex flex-col">
                        {recentSearches.slice(0, 6).map((item: any, i: number) => {
                          const keyword = typeof item === "string" ? item : item.query || item.text || item.keyword || "";
                          return (
                            <div
                              key={i}
                              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
                            >
                              <button
                                onClick={() => executeSearch(keyword)}
                                className="flex items-center gap-3 flex-1 min-w-0 text-left"
                              >
                                <RiSearchLine className="size-4 text-muted-foreground shrink-0" />
                                <span className="text-sm text-foreground truncate">{keyword}</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRecentSearches((prev) => prev.filter((_, idx) => idx !== i));
                                  fetch(`/api/search/recent/remove/${encodeURIComponent(keyword)}`, { method: "DELETE" });
                                }}
                                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-accent rounded-full transition-all shrink-0"
                              >
                                <IoClose className="size-3.5 text-muted-foreground" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">No Recent Search</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        )}
        {/* Right hand side Navbar */}
        <div
          className={
            pathname === "/vflix" || pathname.startsWith("/vflix/")
              ? "flex-1 flex items-center justify-end gap-x-4 pr-4 lg:pr-[4rem]"
              : pathname.startsWith("/messages")
                ? "flex-1 flex items-center justify-end gap-x-4 pr-4 lg:pr-12"
                : pathname.startsWith("/settings")
                  ? "flex-1 flex items-center justify-end gap-x-4 pr-[4.5rem] lg:pr-[5rem]"
                  : "flex items-center justify-end px-4 lg:pl-6 lg:pr-12 lg:w-[24rem] lg:shrink-0"
          }
        >
          <div className={
            pathname === "/vflix" || pathname.startsWith("/vflix/") || pathname.startsWith("/settings") || pathname.startsWith("/messages")
              ? "contents"
              : "flex-1 flex items-center justify-end gap-x-4"
          }>
            {/* Theme Toggle */}
            <button
              className="text-muted-foreground hover:text-foreground hidden sm:block transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "light" ? (
                <Moon className="size-6" />
              ) : (
                <Sun className="size-[22px]" />
              )}
            </button>

            {isGuest ? null : <div className="relative">
              <Notification />
            </div>}

            {/* Wallet Icon */}
            {/* <button className="text-muted-foreground hover:text-foreground hidden sm:block">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
            </button> */}

            {/* Profile — disabled for guests */}
            {isGuest ? (
              <div className="flex items-center gap-x-2 opacity-50 cursor-not-allowed select-none">
                <CustomAvatar
                  src=""
                  name="?"
                  className="size-8 md:size-9"
                />
              </div>
            ) : (
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-x-2 cursor-pointer">
                  <CustomAvatar
                    src={user?.profile_picture || ""}
                    name={getInitials(user?.name || "")}
                    className="size-8 md:size-9"
                  />
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-bold uppercase">
                      {user?.name.split(" ")[0]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @{user?.username || ""}
                    </span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-48 p-3 rounded-xl shadow-md border bg-background z-50"
                align="end"
              >
                <div className="flex flex-col gap-2">
                  <Link href={`/u/${user?.username || ""}`}>
                    <Button
                      variant="ghost"
                      className="w-full text-foreground justify-start h-10 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
                    >
                      View Profile
                    </Button>
                  </Link>

                  <div className="border-t my-1" />

                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 px-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/15 transition"
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
