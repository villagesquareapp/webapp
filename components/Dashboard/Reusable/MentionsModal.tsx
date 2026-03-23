"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "components/ui/dialog";
import { IoClose, IoSearch } from "react-icons/io5";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { useDebounce } from "src/hooks/use-debounce";

interface MentionUser {
    uuid: string;
    username: string;
    name: string;
    profile_picture: string;
    verification_badge: boolean;
}

interface MentionsModalProps {
    open: boolean;
    onClose: () => void;
    onSelectUser?: (username: string) => void;
}

const MentionsModal = ({ open, onClose, onSelectUser }: MentionsModalProps) => {
    const [searchValue, setSearchValue] = useState("@");
    const debouncedSearch = useDebounce(searchValue, 300);
    const [results, setResults] = useState<MentionUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Remove the `@` prefix for the actual search term
        const searchTerm = debouncedSearch.startsWith("@") ? debouncedSearch.slice(1) : debouncedSearch;

        // Requirements: For mention (@), no user should show until typing to search.
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }

        // Use a request ID to prevent stale results from overwriting newer ones
        let isCurrent = true;

        const fetchMentions = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/mentions?q=${encodeURIComponent(searchTerm)}`,
                );
                const data = await res.json();
                if (!isCurrent) return; // Discard stale response
                if (data?.status && data?.data) {
                    setResults(data.data);
                } else {
                    setResults([]);
                }
            } catch (error) {
                if (!isCurrent) return;
                console.error("Failed to fetch mentions", error);
                setResults([]);
            } finally {
                if (isCurrent) setLoading(false);
            }
        };

        fetchMentions();

        return () => {
            isCurrent = false; // Mark request as stale on cleanup
        };
    }, [debouncedSearch]);

    const handleSelect = (username: string) => {
        if (onSelectUser) {
            onSelectUser(username);
        }
        onClose();
        setSearchValue("@"); // Reset search on close
    };

    // Reset search when modal opens/closes
    useEffect(() => {
        if (!open) {
            setSearchValue("@");
            setResults([]);
        }
    }, [open]);

    const searchTerm = searchValue.startsWith("@") ? searchValue.slice(1) : searchValue;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[420px] w-full p-0 rounded-[20px] overflow-hidden border border-border bg-background shadow-2xl [&>button:last-child]:hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4">
                    <h2 className="text-[15px] text-foreground">
                        <span className="font-bold">Mentions</span>{" "}
                        <span className="text-muted-foreground font-normal">(Add people to post)</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-accent rounded-full transition-colors"
                    >
                        <IoClose className="text-muted-foreground size-4" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="px-5 pb-3">
                    <div className="relative">
                        <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            placeholder="username"
                            value={searchValue}
                            onChange={(e) => {
                                let val = e.target.value;
                                if (!val.startsWith("@")) {
                                    val = "@" + val.replace(/@/g, ""); // Ensure single @ prefix
                                }
                                setSearchValue(val);
                            }}
                            className="w-full bg-accent h-[42px] pl-[42px] pr-4 text-[14px] text-foreground placeholder:text-muted-foreground rounded-full outline-none border border-border focus:border-border transition-colors"
                        />
                    </div>
                    {/* Subtle loading bar below the input */}
                    <div className="h-[2px] mt-1.5 rounded-full overflow-hidden">
                        {loading && (
                            <div className="h-full bg-blue-500/60 animate-pulse rounded-full" />
                        )}
                    </div>
                </div>

                {/* Results List */}
                <div className="px-3 pb-4 max-h-[380px] overflow-y-auto no-scrollbar">
                    {/* Only show full "Searching..." when results list is empty */}
                    {loading && results.length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Searching...
                        </div>
                    )}

                    {!loading && results.length === 0 && searchTerm.trim() && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No users found.
                        </div>
                    )}

                    {!loading && !searchTerm.trim() && (
                        <div className="py-6 text-center text-[13px] text-muted-foreground">
                            Type a name or username to search...
                        </div>
                    )}

                    {/* Always render results if available, even while loading */}
                    {results.length > 0 &&
                        results.map((user) => (
                            <button
                                key={user.uuid}
                                onClick={() => handleSelect(user.username)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent transition-colors text-left"
                            >
                                <CustomAvatar
                                    src={user.profile_picture}
                                    name={user.name}
                                    className="size-11 flex-shrink-0"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-foreground line-clamp-1 leading-snug">
                                        {user.name}
                                    </span>
                                    <span className="text-[13px] text-muted-foreground line-clamp-1">
                                        {user.username}
                                    </span>
                                </div>
                            </button>
                        ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MentionsModal;
