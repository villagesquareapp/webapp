"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "components/ui/dialog";
import { IoClose, IoSearch } from "react-icons/io5";
import { Plus } from "lucide-react";
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

const formatUsageCount = (countStr: string) => {
    const count = parseInt(countStr, 10);
    if (isNaN(count)) return "0 posts";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M posts`;
    if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K posts`;
    return `${count} posts`;
};

const HashtagsModal = ({ open, onClose, onSelectHashtag }: HashtagsModalProps) => {
    const [searchValue, setSearchValue] = useState("#");
    const debouncedSearch = useDebounce(searchValue, 300);
    const [results, setResults] = useState<HashtagData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const searchTerm = debouncedSearch.startsWith("#") ? debouncedSearch.slice(1) : debouncedSearch;

        let isCurrent = true;
        const fetchHashtags = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/hashtags?q=${encodeURIComponent(searchTerm)}`);
                const data = await res.json();
                if (!isCurrent) return;
                setResults(data?.status && data?.data ? data.data : []);
            } catch {
                if (!isCurrent) return;
                setResults([]);
            } finally {
                if (isCurrent) setLoading(false);
            }
        };
        fetchHashtags();
        return () => { isCurrent = false; };
    }, [debouncedSearch]);

    // Reset on close
    useEffect(() => {
        if (!open) {
            setSearchValue("#");
            setResults([]);
            setSelectedTags([]);
        } else {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    const addCurrentTag = () => {
        const raw = searchValue.startsWith("#") ? searchValue.slice(1).trim() : searchValue.trim();
        if (!raw) return;
        if (!selectedTags.includes(raw)) {
            setSelectedTags((prev) => [...prev, raw]);
        }
        setSearchValue("#");
        inputRef.current?.focus();
    };

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const removeTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    const handleAddToPost = () => {
        if (selectedTags.length === 0) return;
        selectedTags.forEach((tag) => onSelectHashtag?.(tag));
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCurrentTag();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[420px] w-full p-0 rounded-[20px] overflow-hidden border border-border bg-background shadow-2xl [&>button:last-child]:hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
                    <h2 className="text-[15px] text-foreground">
                        <span className="font-bold">Hashtags</span>{" "}
                        <span className="text-muted-foreground font-normal">(Add hashtags to post)</span>
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-accent rounded-full transition-colors">
                        <IoClose className="text-muted-foreground size-4" />
                    </button>
                </div>

                {/* Search Input + Plus button */}
                <div className="px-5 pb-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground pointer-events-none" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="search hashtags"
                                value={searchValue}
                                onChange={(e) => {
                                    let val = e.target.value;
                                    if (!val.startsWith("#")) val = "#" + val.replace(/#/g, "");
                                    setSearchValue(val);
                                }}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-accent h-[42px] pl-[42px] pr-4 text-[14px] text-foreground placeholder:text-muted-foreground rounded-full outline-none border border-border focus:border-ring transition-colors"
                            />
                        </div>
                        {/* + button to add typed hashtag */}
                        <button
                            onClick={addCurrentTag}
                            disabled={!searchValue || searchValue === "#"}
                            className="size-[42px] rounded-full bg-accent border border-border flex items-center justify-center hover:bg-accent/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                            <Plus className="size-5 text-foreground" />
                        </button>
                    </div>
                    {/* Loading bar */}
                    <div className="h-[2px] mt-1.5 rounded-full overflow-hidden">
                        {loading && <div className="h-full bg-blue-500/60 animate-pulse rounded-full" />}
                    </div>
                </div>

                {/* Selected tags chips */}
                {selectedTags.length > 0 && (
                    <div className="px-5 pb-3 flex flex-wrap gap-2 shrink-0">
                        {selectedTags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1.5 bg-blue-600/15 border border-blue-500/30 text-blue-400 text-[13px] font-medium px-3 py-1 rounded-full"
                            >
                                #{tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="hover:text-blue-200 transition-colors"
                                >
                                    <IoClose className="size-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Results List */}
                <div className="px-3 flex-1 overflow-y-auto no-scrollbar min-h-0">
                    {loading && results.length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">Searching...</div>
                    )}
                    {!loading && results.length === 0 && debouncedSearch.length > 1 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">No hashtags found.</div>
                    )}
                    {!loading && (!debouncedSearch || debouncedSearch === "#") && (
                        <div className="py-6 text-center text-[13px] text-muted-foreground">Type a hashtag to search...</div>
                    )}
                    {results.map((tag) => {
                        const isSelected = selectedTags.includes(tag.display_form);
                        return (
                            <button
                                key={tag.uuid}
                                onClick={() => toggleTag(tag.display_form)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors text-left ${isSelected ? "bg-blue-600/10" : "hover:bg-accent"}`}
                            >
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-foreground line-clamp-1 mb-0.5">
                                        #{tag.display_form}
                                    </span>
                                    <span className="text-[13px] text-muted-foreground">
                                        {formatUsageCount(tag.usage_count)}
                                    </span>
                                </div>
                                {isSelected && (
                                    <div className="size-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                        <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Add selected tags to post button */}
                <div className="px-5 py-4 shrink-0 border-t border-border">
                    <button
                        onClick={handleAddToPost}
                        disabled={selectedTags.length === 0}
                        className="w-full h-12 rounded-xl bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white font-semibold text-[15px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Add selected tags to post
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HashtagsModal;
