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

        const fetchMentions = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/mentions?q=${encodeURIComponent(
                        searchTerm,
                    )}`,
                );
                const data = await res.json();
                if (data?.status && data?.data) {
                    setResults(data.data);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Failed to fetch mentions", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMentions();
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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[420px] w-full p-0 rounded-[20px] overflow-hidden border border-white/10 bg-[#1C1C1E] shadow-2xl [&>button:last-child]:hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4">
                    <h2 className="text-[15px] text-white">
                        <span className="font-bold">Mentions</span>{" "}
                        <span className="text-white/60 font-normal">(Add people to post)</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <IoClose className="text-white/70 size-4" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="px-5 pb-3">
                    <div className="relative">
                        <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] text-white/50 pointer-events-none" />
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
                            className="w-full bg-[#131313] h-[42px] pl-[42px] pr-4 text-[14px] text-white placeholder:text-white/50 rounded-full outline-none border border-white/5 focus:border-white/10 transition-colors"
                        />
                    </div>
                </div>

                {/* Results List */}
                <div className="px-3 pb-4 max-h-[380px] overflow-y-auto no-scrollbar">
                    {loading && (
                        <div className="py-6 text-center text-sm text-white/50">
                            Searching...
                        </div>
                    )}

                    {!loading && results.length === 0 && searchValue.trim() !== "@" && (
                        <div className="py-6 text-center text-sm text-white/50">
                            No users found.
                        </div>
                    )}

                    {!loading && searchValue.trim() === "@" && (
                        <div className="py-6 text-center text-[13px] text-white/40">
                            Type a name or username to search...
                        </div>
                    )}

                    {!loading &&
                        results.length > 0 &&
                        results.map((user) => (
                            <button
                                key={user.uuid}
                                onClick={() => handleSelect(user.username)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                            >
                                <CustomAvatar
                                    src={user.profile_picture}
                                    name={user.name}
                                    className="size-11 flex-shrink-0"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-white line-clamp-1 leading-snug">
                                        {user.name}
                                    </span>
                                    <span className="text-[13px] text-white/50 line-clamp-1">
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
