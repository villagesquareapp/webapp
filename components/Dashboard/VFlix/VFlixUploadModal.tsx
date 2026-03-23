"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePostUploadContext } from "context/PostUploadContext";
import { createVflixPost } from "app/api/vflix";
import { Dialog, DialogContent } from "components/ui/dialog";
import { Button } from "components/ui/button";
import { IoClose } from "react-icons/io5";
import { useVFlixUpload } from "context/VFlixUploadContext";
import { TfiAngleRight } from "react-icons/tfi";
import { Switch } from "components/ui/switch";
import { VscMention } from "react-icons/vsc";
import { FiHash } from "react-icons/fi";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { useDebounce } from "src/hooks/use-debounce";
import Image from "next/image";
import LocationPicker from "components/Dashboard/Social/LocationPicker";

interface HashtagData {
  uuid: string;
  canonical_form: string;
  display_form: string;
  usage_count: string;
}

interface MentionUser {
  uuid: string;
  username: string;
  name: string;
  profile_picture: string;
  verification_badge: boolean;
}

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
  if (count >= 1000000)
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M posts`;
  if (count >= 1000)
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K posts`;
  return `${count} posts`;
};

const VFlixUploadModal = ({ user }: { user: any }) => {
  const { isVFlixUploadOpen, closeVFlixUpload } = useVFlixUpload();
  const [step, setStep] = useState<1 | 2>(1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [privacySetting, setPrivacySetting] = useState<
    "Everyone" | "Friends / Followers" | "Only me"
  >("Everyone");
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [allowComments, setAllowComments] = useState(true);

  // Location state
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedLatitude, setSelectedLatitude] = useState<string | null>(null);
  const [selectedLongitude, setSelectedLongitude] = useState<string | null>(null);

  // Hashtags & Mentions State
  const [activeHashtagSearch, setActiveHashtagSearch] = useState<string | null>(
    null,
  );
  const [hashtagResults, setHashtagResults] = useState<HashtagData[]>([]);
  const [loadingHashtags, setLoadingHashtags] = useState(false);

  const [activeMentionSearch, setActiveMentionSearch] = useState<string | null>(
    null,
  );
  const [mentionResults, setMentionResults] = useState<MentionUser[]>([]);
  const [loadingMentions, setLoadingMentions] = useState(false);

  const debouncedHashtagSearch = useDebounce(activeHashtagSearch ?? "", 300);
  const debouncedMentionSearch = useDebounce(activeMentionSearch ?? "", 300);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const captionInputRef = useRef<HTMLTextAreaElement>(null);
  const { uploadFileAndGetInfo, startBackgroundUpload } =
    usePostUploadContext();

  // Reset state when modal closes
  useEffect(() => {
    if (!isVFlixUploadOpen) {
      setTimeout(() => {
        setStep(1);
        setVideoFile(null);
        setVideoPreviewUrl(null);
        setCaption("");
        setPrivacySetting("Everyone");
        setIsPrivacyOpen(false);
        setAllowComments(true);
        setIsLocationPickerOpen(false);
        setSelectedAddress(null);
        setSelectedLatitude(null);
        setSelectedLongitude(null);
        setActiveHashtagSearch(null);
        setHashtagResults([]);
        setActiveMentionSearch(null);
        setMentionResults([]);
      }, 300);
    }
  }, [isVFlixUploadOpen]);

  // Hashtags Fetch Effect
  useEffect(() => {
    if (activeHashtagSearch === null) {
      setHashtagResults([]);
      return;
    }

    const searchTerm = debouncedHashtagSearch;
    if (!searchTerm.trim()) {
      setHashtagResults(DUMMY_TRENDING_HASHTAGS);
      return;
    }

    let isCurrent = true;
    const fetchHashtags = async () => {
      setLoadingHashtags(true);
      try {
        const res = await fetch(
          `/api/hashtags?q=${encodeURIComponent(searchTerm)}`,
        );
        const data = await res.json();
        if (!isCurrent) return;
        if (data?.status && data?.data) {
          setHashtagResults(data.data);
        } else {
          setHashtagResults([]);
        }
      } catch (error) {
        if (!isCurrent) return;
        setHashtagResults([]);
      } finally {
        if (isCurrent) setLoadingHashtags(false);
      }
    };

    fetchHashtags();
    return () => {
      isCurrent = false;
    };
  }, [debouncedHashtagSearch, activeHashtagSearch]);

  // Mentions Fetch Effect
  useEffect(() => {
    if (activeMentionSearch === null) {
      setMentionResults([]);
      return;
    }

    const searchTerm = debouncedMentionSearch;
    if (!searchTerm.trim()) {
      setMentionResults([]);
      return;
    }

    let isCurrent = true;
    const fetchMentions = async () => {
      setLoadingMentions(true);
      try {
        const res = await fetch(
          `/api/mentions?q=${encodeURIComponent(searchTerm)}`,
        );
        const data = await res.json();
        if (!isCurrent) return;
        if (data?.status && data?.data) {
          setMentionResults(data.data);
        } else {
          setMentionResults([]);
        }
      } catch (error) {
        if (!isCurrent) return;
        setMentionResults([]);
      } finally {
        if (isCurrent) setLoadingMentions(false);
      }
    };

    fetchMentions();
    return () => {
      isCurrent = false;
    };
  }, [debouncedMentionSearch, activeMentionSearch]);

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCaption(val);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = val.substring(0, cursorPosition);

    // Find if we are currently typing a mention or hashtag
    const mentionMatch = textBeforeCursor.match(/@([\w.]*)$/);
    const hashtagMatch = textBeforeCursor.match(/#([\w]*)$/);

    if (mentionMatch) {
      setActiveMentionSearch(mentionMatch[1]);
      setActiveHashtagSearch(null);
    } else if (hashtagMatch) {
      setActiveHashtagSearch(hashtagMatch[1]);
      setActiveMentionSearch(null);
    } else {
      setActiveMentionSearch(null);
      setActiveHashtagSearch(null);
    }
  };

  const insertTextToCaption = (
    textToInsert: string,
    type: "mention" | "hashtag",
  ) => {
    if (!captionInputRef.current) return;
    const cursorPosition = captionInputRef.current.selectionStart;
    const textBeforeCursor = caption.substring(0, cursorPosition);
    const textAfterCursor = caption.substring(cursorPosition);

    const regex = type === "mention" ? /@([\w.]*)$/ : /#([\w]*)$/;
    const match = textBeforeCursor.match(regex);

    if (match) {
      const index = match.index!;
      const insertedText = type === "mention" ? `@${textToInsert} ` : `#${textToInsert} `;
      const newCaption =
        caption.substring(0, index) +
        insertedText +
        textAfterCursor;

      const newCursorPos = index + insertedText.length;
      setCaption(newCaption);

      setTimeout(() => {
        if (captionInputRef.current) {
          captionInputRef.current.focus();
          captionInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }

    setActiveMentionSearch(null);
    setActiveHashtagSearch(null);
  };

  const handleTagPeopleClick = () => {
    setCaption((prev) => {
      const newCaption = prev + (prev && !prev.endsWith(" ") ? " @" : "@");
      setTimeout(() => {
        if (captionInputRef.current) {
          captionInputRef.current.focus();
          const len = newCaption.length;
          captionInputRef.current.setSelectionRange(len, len);
        }
      }, 0);
      return newCaption;
    });
    setActiveMentionSearch("");
    setActiveHashtagSearch(null);
  };

  const handleHashtagsClick = () => {
    setCaption((prev) => {
      const newCaption = prev + (prev && !prev.endsWith(" ") ? " #" : "#");
      setTimeout(() => {
        if (captionInputRef.current) {
          captionInputRef.current.focus();
          const len = newCaption.length;
          captionInputRef.current.setSelectionRange(len, len);
        }
      }, 0);
      return newCaption;
    });
    setActiveHashtagSearch("");
    setActiveMentionSearch(null);
  };

  const handlePost = async () => {
    if (!videoFile) {
      toast.error("Please select a video to upload.");
      return;
    }

    // Close modal immediately
    closeVFlixUpload();

    // Capture values before state resets
    const file = videoFile;
    const currentCaption = caption.trim();
    const currentPrivacy = privacySetting;
    const currentAllowComments = allowComments;
    const currentAddress = selectedAddress;
    const currentLatitude = selectedLatitude;
    const currentLongitude = selectedLongitude;

    startBackgroundUpload(async () => {
      const fileExtension = file.name.split(".").pop() || "mp4";
      const cleanFileName = `video_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
      const renamedVideoFile = new File([file], cleanFileName, {
        type: file.type,
      });

      const fileId = `vflix-${Date.now()}`;
      const uploadedMedia = await uploadFileAndGetInfo(
        renamedVideoFile,
        fileId,
      );

      if (!uploadedMedia || !uploadedMedia.key) {
        throw new Error(
          "Upload failed: Could not retrieve the video file key.",
        );
      }

      let mappedPrivacy = "everyone";
      if (currentPrivacy === "Friends / Followers") mappedPrivacy = "followers";
      if (currentPrivacy === "Only me") mappedPrivacy = "only_me";


      const payload = {
        media: [{ key: uploadedMedia.key, mime_type: uploadedMedia.mime_type }],
        caption: currentCaption,
        privacy: mappedPrivacy,
        allow_comments: currentAllowComments,
        address: currentAddress,
        latitude: currentLatitude,
        longitude: currentLongitude,
        language: "en",
        culture_tag: null,
        audio_id: null,
        series_id: null,
        episode_number: null,
      };

      const response = await createVflixPost(payload);

      if (!response?.status) {
        throw new Error(response?.message || "Failed to publish VFlix");
      }

      toast.success("VFlix published successfully!");
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file.");
        return;
      }
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please drop a valid video file.");
        return;
      }
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handleClose = () => {
    closeVFlixUpload();
  };

  if (!isVFlixUploadOpen) return null;

  return (
    <Dialog
      open={isVFlixUploadOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent
        className={`
    fixed top-[10%] left-1/2 -translate-x-1/2 translate-y-0
    flex flex-col p-0 rounded-2xl overflow-hidden
    border border-border bg-background shadow-2xl
    [&>button:last-child]:hidden transition-all duration-300
    ${step === 1 ? "max-w-[550px]" : "max-w-[800px]"} w-full
  `}
      >
        {step === 1 && (
          <div
            className="flex flex-col items-center justify-center p-12 min-h-[400px] bg-background"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="mb-6 opacity-30">
              {/* <ImageIcon className="w-24 h-24" strokeWidth={1} /> */}
              <Image
                src={"/images/image-selector.png"}
                alt=""
                width={100}
                height={90}
                className="opacity-25"
              />
            </div>

            <h2 className="text-foreground text-lg font-semibold tracking-wide mb-2">
              Select Media to Upload
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Or drag photos and video here
            </p>

            <Button
              className="bg-[#0D52D2] hover:bg-[#094DB5BF]/90 text-white px-10 w-[50%] h-12 rounded-full font-medium"
              onClick={() => fileInputRef.current?.click()}
            >
              Select
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col bg-background h-[700px] relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-foreground font-semibold text-lg">Create Post</h3>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-white/5 rounded-full transition-colors"
              >
                <IoClose className="text-foreground size-5 opacity-80" />
              </button>
            </div>

            <div className="flex flex-row p-6 gap-x-6 flex-1 min-h-0">
              {/* Left Side: Video Preview */}
              <div className="w-[45%] h-[450px] rounded-xl overflow-hidden bg-black flex shrink-0">
                {videoPreviewUrl && (
                  <video
                    src={videoPreviewUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              </div>

              {/* Right Side: Form Controls */}
              <div className="flex flex-col flex-1 h-full">
                <div className="relative w-full min-h-[120px] mb-4">
                  {/* Highlight Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none text-[15px] font-normal whitespace-pre-wrap break-words p-0 m-0 z-0 text-foreground"
                    aria-hidden="true"
                  >
                    {!caption ? (
                      <span className="text-gray-500 text-sm">
                        Say something about this post...
                      </span>
                    ) : (
                      caption.split(/(\s+)/).map((part, i) => {
                        if (
                          /^@[\w\d._]*/.test(part) ||
                          /^#[\w\d_]*/.test(part)
                        ) {
                          return (
                            <span key={i} className="text-blue-500 font-medium">
                              {part}
                            </span>
                          );
                        }
                        return <span key={i} className="text-foreground">{part}</span>;
                      })
                    )}
                    {/* Trailing newline fix */}
                    {caption.endsWith("\n") && <br />}
                  </div>

                  <textarea
                    ref={captionInputRef}
                    value={caption}
                    onChange={handleCaptionChange}
                    className="relative w-full h-[120px] resize-none bg-transparent text-[15px] font-normal text-transparent caret-foreground outline-none border-none ring-0 focus:ring-0 p-0 m-0 z-10 overflow-hidden"
                    maxLength={500}
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-row gap-x-3 mb-6 mt-12 relative">
                  <button
                    onClick={handleTagPeopleClick}
                    className="flex items-center gap-x-2 bg-background hover:bg-background/10 text-foreground text-xs font-medium px-4 py-2 rounded-full transition-colors"
                  >
                    <span className="text-foreground">@</span> Tag people
                  </button>
                  <button
                    onClick={handleHashtagsClick}
                    className="flex items-center gap-x-2 bg-background hover:bg-background/10 text-foreground text-xs font-medium px-4 py-2 rounded-full transition-colors"
                  >
                    <span className="text-foreground">#</span> Hashtags
                  </button>

                  {/* Inline Hashtags Dropdown */}
                  {activeHashtagSearch !== null && (
                    <div className="absolute top-full mt-2 left-0 w-[240px] z-30 bg-background border border-border shadow-2xl rounded-xl max-h-[280px] overflow-y-auto no-scrollbar py-2">
                      {loadingHashtags && hashtagResults.length === 0 && (
                        <div className="py-4 text-center text-[13px] text-foreground">
                          Searching...
                        </div>
                      )}
                      {!loadingHashtags && hashtagResults.length === 0 && (
                        <div className="py-4 text-center text-[13px] text-foreground">
                          No hashtags found.
                        </div>
                      )}
                      {hashtagResults.map((tag) => (
                        <button
                          key={tag.uuid}
                          onClick={() =>
                            insertTextToCaption(tag.display_form, "hashtag")
                          }
                          className="w-full flex flex-col px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                        >
                          <span className="text-[14px] font-bold text-foreground line-clamp-1 mb-0.5">
                            #{tag.display_form}
                          </span>
                          <span className="text-[12px] text-foreground/50">
                            {formatUsageCount(tag.usage_count)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Inline Mentions Dropdown */}
                  {activeMentionSearch !== null && (
                    <div className="absolute top-full mt-2 left-0 w-[240px] z-30 bg-background border border-border shadow-2xl rounded-xl max-h-[280px] overflow-y-auto no-scrollbar py-2">
                      {loadingMentions && mentionResults.length === 0 && (
                        <div className="py-4 text-center text-[13px] text-foreground">
                          Searching...
                        </div>
                      )}
                      {!loadingMentions &&
                        mentionResults.length === 0 &&
                        activeMentionSearch.trim() && (
                          <div className="py-4 text-center text-[13px] text-foreground">
                            No users found.
                          </div>
                        )}
                      {!loadingMentions && !activeMentionSearch.trim() && (
                        <div className="py-4 text-center text-[12px] text-foreground">
                          Type a username to search...
                        </div>
                      )}
                      {mentionResults.map((user) => (
                        <button
                          key={user.uuid}
                          onClick={() =>
                            insertTextToCaption(user.username, "mention")
                          }
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                        >
                          <CustomAvatar
                            src={user.profile_picture}
                            name={user.name}
                            className="size-9 flex-shrink-0"
                          />
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-foreground line-clamp-1 leading-snug">
                              {user.name}
                            </span>
                            <span className="text-[12px] text-gray-500 line-clamp-1">
                              @{user.username}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-y-1 relative rounded-xl">
                  <button
                    onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
                    className={`flex items-center justify-between text-foreground hover:bg-white/5 py-3 px-2 transition-all ${isPrivacyOpen ? "rounded-t-xl rounded-b-none bg-white/5" : "rounded-xl"}`}
                  >
                    <div className="flex items-center gap-x-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span className="text-[15px] font-normal">
                        {privacySetting}
                      </span>
                    </div>
                    <TfiAngleRight
                      className={`text-gray-500 transition-transform ${isPrivacyOpen ? "rotate-90" : ""}`}
                    />
                  </button>

                  {isPrivacyOpen && (
                    <div className="absolute top-[48px] left-0 w-full z-20 bg-popover border border-border shadow-2xl rounded-b-xl flex flex-col pt-1 pb-2">
                      <button
                        onClick={() => {
                          setPrivacySetting("Everyone");
                          setIsPrivacyOpen(false);
                        }}
                        className="flex items-center justify-between p-3 hover:bg-white/5 text-left transition-colors"
                      >
                        <div className="flex items-center gap-x-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-300"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="2" y1="12" x2="22" y2="12"></line>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-foreground text-[13px] font-medium">
                              Everyone
                            </span>
                            <span className="text-gray-500 text-[11px]">
                              Everyone can see your posts.
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${privacySetting === "Everyone" ? "border-none bg-[#0D52D2]" : "border-gray-500"}`}
                        >
                          {privacySetting === "Everyone" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setPrivacySetting("Friends / Followers");
                          setIsPrivacyOpen(false);
                        }}
                        className="flex items-center justify-between p-3 hover:bg-white/5 text-left transition-colors"
                      >
                        <div className="flex items-center gap-x-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-300"
                            >
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-foreground text-[13px] font-medium">
                              Friends / Followers
                            </span>
                            <span className="text-gray-500 text-[11px]">
                              Limited to your friends or followers.
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${privacySetting === "Friends / Followers" ? "border-none bg-[#0D52D2]" : "border-gray-500"}`}
                        >
                          {privacySetting === "Friends / Followers" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setPrivacySetting("Only me");
                          setIsPrivacyOpen(false);
                        }}
                        className="flex items-center justify-between p-3 hover:bg-white/5 text-left transition-colors"
                      >
                        <div className="flex items-center gap-x-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-300"
                            >
                              <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                                ry="2"
                              ></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-foreground text-[13px] font-medium">
                              Only me
                            </span>
                            <span className="text-gray-500 text-[11px]">
                              Only you can see this post
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${privacySetting === "Only me" ? "border-none bg-[#0D52D2]" : "border-gray-500"}`}
                        >
                          {privacySetting === "Only me" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                      </button>
                    </div>
                  )}

                  <div
                    onClick={() => setIsLocationPickerOpen(true)}
                    className="flex items-center justify-between text-white hover:bg-white/5 py-3 px-2 rounded-xl transition-all cursor-pointer relative"
                  >
                    <div className="flex items-center gap-x-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={selectedAddress ? "text-blue-400" : "text-gray-400"}
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span className={`text-[15px]  font-normal truncate max-w-[160px] ${selectedAddress ? "text-blue-400" : "text-foreground"}`}>
                        {selectedAddress || "Add location"}
                      </span>
                    </div>
                    {selectedAddress ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAddress(null);
                          setSelectedLatitude(null);
                          setSelectedLongitude(null);
                        }}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <IoClose className="text-foreground size-4" />
                      </div>
                    ) : (
                      <TfiAngleRight className="text-gray-500" />
                    )}

                    {/* Location Picker dropdown */}
                    <LocationPicker
                      open={isLocationPickerOpen}
                      onClose={() => setIsLocationPickerOpen(false)}
                      onSelect={(loc) => {
                        setSelectedAddress(loc.address);
                        setSelectedLatitude(loc.latitude);
                        setSelectedLongitude(loc.longitude);
                      }}
                      currentAddress={selectedAddress || undefined}
                    />
                  </div>



                  <div className="flex items-center justify-between text-white p-3 rounded-xl">
                    <div className="flex items-center gap-x-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span className="text-[15px] text-foreground font-normal">
                        Allow comments
                      </span>
                    </div>
                    <Switch
                      checked={allowComments}
                      onCheckedChange={setAllowComments}
                    />
                  </div>
                </div>
              </div>
            </div>



            {/* Footer: Post Button */}
            <div className="flex justify-end px-6 pb-6">
              <Button
                className="bg-[#0D52D2] hover:bg-[#094DB5BF]/90 text-white px-8 h-12 w-[150px] rounded-full font-medium"
                onClick={handlePost}
                disabled={!videoFile}
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VFlixUploadModal;
