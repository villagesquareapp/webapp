"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "components/ui/dialog";
import { IoClose, IoSearch } from "react-icons/io5";
import { useDebounce } from "src/hooks/use-debounce";

interface HashtagData {
    uuid: string;
    canonical_form: string;
    display_form: string;
    usage_count: string;
}

interface HashtagsModalProps {
    open: boolean;
    onClose: () => void;
    onSelectHashtag?: (hashtag: string) => void;
}

// Dummy trending hashtags for when search is empty (as requested)
const DUMMY_TRENDING_HASHTAGS: HashtagData[] = [
    {
        uuid: "1",
        canonical_form: "productdesigner",
        display_form: "productdesigner",
        usage_count: "72000",
    },
    {
        uuid: "2",
        canonical_form: "techindustry",
        display_form: "techindustry",
        usage_count: "6500000",
    },
    {
        uuid: "3",
        canonical_form: "artificialintelligence",
        display_form: "artificialintelligence",
        usage_count: "3200000",
    },
    {
        uuid: "4",
        canonical_form: "love",
        display_form: "love",
        usage_count: "10000",
    },
    {
        uuid: "5",
        canonical_form: "zaroncosmetics",
        display_form: "zaroncosmetics",
        usage_count: "5000000",
    },
    {
        uuid: "6",
        canonical_form: "piggyvestapp",
        display_form: "piggyvestapp",
        usage_count: "2700",
    },
    {
        uuid: "7",
        canonical_form: "apple",
        display_form: "apple",
        usage_count: "18000000",
    },
];

const formatUsageCount = (countStr: string) => {
    const count = parseInt(countStr, 10);
    if (isNaN(count)) return "0 posts";

    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M posts`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K posts`;
    }
    return `${count} posts`;
};

const HashtagsModal = ({ open, onClose, onSelectHashtag }: HashtagsModalProps) => {
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearch = useDebounce(searchValue, 300);
    const [results, setResults] = useState<HashtagData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If empty search, show dummy trending
        if (!debouncedSearch.trim()) {
            setResults(DUMMY_TRENDING_HASHTAGS);
            return;
        }

        const fetchHashtags = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/hashtags?q=${encodeURIComponent(
                        debouncedSearch,
                    )}`,
                );
                const data = await res.json();
                if (data?.status && data?.data) {
                    setResults(data.data);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Failed to fetch hashtags", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHashtags();
    }, [debouncedSearch]);

    const handleSelect = (hashtag: string) => {
        if (onSelectHashtag) {
            onSelectHashtag(hashtag);
        }
        onClose();
        setSearchValue(""); // Reset search on close
    };

    // Reset search when modal opens/closes
    useEffect(() => {
        if (!open) {
            setSearchValue("");
            setResults(DUMMY_TRENDING_HASHTAGS);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[420px] w-full p-0 rounded-[20px] overflow-hidden border border-white/10 bg-[#1C1C1E] shadow-2xl [&>button:last-child]:hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4">
                    <h2 className="text-[15px] text-white">
                        <span className="font-bold">Hashtags</span>{" "}
                        <span className="text-white/60 font-normal">(Add hashtag to post)</span>
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
                            placeholder="Search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
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

                    {!loading && results.length === 0 && (
                        <div className="py-6 text-center text-sm text-white/50">
                            No hashtags found.
                        </div>
                    )}

                    {!loading &&
                        results.length > 0 &&
                        results.map((tag) => (
                            <button
                                key={tag.uuid}
                                onClick={() => handleSelect(tag.display_form)}
                                className="w-full flex flex-col px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                            >
                                <span className="text-[14px] font-bold text-white line-clamp-1 mb-0.5">
                                    #{tag.display_form}
                                </span>
                                <span className="text-[13px] text-white/50">
                                    {formatUsageCount(tag.usage_count)}
                                </span>
                            </button>
                        ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HashtagsModal;
