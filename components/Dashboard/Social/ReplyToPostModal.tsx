"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import CustomAvatar from "components/ui/custom/custom-avatar";
import {
  SendHorizonal,
  Image as ImageIcon,
  MapPin,
  Smile,
  X,
  Users,
  Lock,
} from "lucide-react";
import { TbPhoto, TbPlus } from "react-icons/tb";
import { IoVideocamOutline, IoLocationSharp, IoClose } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import { useState, useMemo, useRef, useCallback } from "react";
import { toast } from "sonner";
// import { createPost } from "api/post";
// import { usePostUploader } from "src/hooks/usePostUploader";
import { usePostUploadContext } from "context/PostUploadContext";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "@radix-ui/react-label";
import { LiaGlobeAmericasSolid } from "react-icons/lia";
import { IoIosArrowDown } from "react-icons/io";
import { Dispatch, SetStateAction } from "react";
import { VscMention } from "react-icons/vsc";
import { FiHash } from "react-icons/fi";
import MentionsModal from "../Reusable/MentionsModal";
import HashtagsModal from "../Reusable/HashtagsModal";

interface ReplyModalProps {
  post: IPost;
  user: IUser;
  open: boolean;
  onClose: () => void;
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  onReplySuccess?: (newReply: IPostComment) => void;
  replyToComment?: IPostComment | null;
  isInPostDetails?: boolean;
}

interface DraftItem {
  id: string;
  caption: string;
  media: File[];
  address: string;
  latitude: string;
  longitude: string;
  privacy: PrivacyType;
}

const ReplyModal = ({
  post,
  user,
  open,
  onClose,
  setPosts,
  onReplySuccess,
  replyToComment,
  isInPostDetails = false,
}: ReplyModalProps) => {
  const [newComment, setNewComment] = useState<string>("");
  const charCount = newComment.length;
  const isReplyButtonDisabled = useMemo(() => {
    return !newComment.trim() || charCount > 500;
  }, [newComment, charCount]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [isAudienceDialogOpen, setIsAudienceDialogOpen] =
    useState<boolean>(false);

  // Auto-trigger Modal States
  const [isMentionsOpen, setIsMentionsOpen] = useState(false);
  const [isHashtagsOpen, setIsHashtagsOpen] = useState(false);

  const handleSelectMention = (username: string) => {
    const currentCaption = newComment;
    const nextCaption = currentCaption ? `${currentCaption} @${username}` : `@${username}`;
    setNewComment(nextCaption);
  };

  const handleSelectHashtag = (hashtag: string) => {
    const currentCaption = newComment;
    const nextCaption = currentCaption ? `${currentCaption} #${hashtag}` : `#${hashtag}`;
    setNewComment(nextCaption);
  };

  const [items, setItems] = useState<DraftItem[]>([
    {
      id: String(Date.now()),
      caption: "",
      media: [],
      address: "",
      latitude: "",
      longitude: "",
      privacy: "everyone" as PrivacyType,
    },
  ]);

  const { createPostFunc, uploadFileAndGetInfo } = usePostUploadContext();

  const createReplyFunc = async () => {
    if (!post?.uuid || isReplyButtonDisabled) return;

    // 1. Close Modal Immediately
    onClose();

    // 2. Optimistic Update
    // Construct a temporary reply object
    const tempUuid = `temp-${Date.now()}`;
    const newReply: IPostComment = {
      uuid: tempUuid,
      caption: newComment,
      user_id: user.uuid,
      parent_post_id: post?.uuid,
      root_post_id: post?.uuid,
      quote_post_id: null,
      thread_id: "",
      address: null,
      latitude: null,
      longitude: null,
      privacy: items[0].privacy,
      status: "active",
      views_count: "0",
      shares_count: "0",
      likes_count: "0",
      replies_count: "0",
      impressions: "0",
      additional_metadata: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      formatted_time: "now",
      is_saved: false,
      is_liked: false,
      is_thread_continuation: false,
      media: selectedFile
        ? [
          {
            // Temporary media object for optimistic UI
            uuid: `temp-media-${Date.now()}`,
            post_id: tempUuid,
            media_type: selectedFile.type.startsWith("video")
              ? "video"
              : "image",
            media_url: mediaPreviewUrl || "",
            transcoded_media_url: mediaPreviewUrl || "",
            media_thumbnail: "",
            media_filename: selectedFile.name,
            media_size: selectedFile.size.toString(),
            media_duration: 0,
            is_transcode_complete: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
          },
        ]
        : [],

      user: {
        uuid: user.uuid,
        name: user.name,
        username: user.username,
        profile_picture: user.profile_picture,
        email: user.email ?? "",
        verified_status: user.verified_status ?? 0,
        checkmark_verification_status:
          user.checkmark_verification_status ?? false,
        premium_verification_status: user.premium_verification_status ?? false,
        online: user.online ?? false,
      },
    };

    if (onReplySuccess) {
      onReplySuccess(newReply);
    }

    // Reset Form
    setNewComment("");
    setSelectedFile(null);
    setMediaPreviewUrl(null);

    // 3. Background Process
    (async () => {
      try {
        let uploadedFiles: { key: string; mime_type: string }[] = [];
        if (selectedFile) {
          const fileId = `${post.uuid}-${Date.now()}`;
          const fileInfo = await uploadFileAndGetInfo(selectedFile, fileId);
          uploadedFiles.push(fileInfo);
        }

        const replyPayload = {
          media: uploadedFiles.length > 0 ? uploadedFiles : undefined,
          caption: newComment,
          parent_post_id: post?.uuid,
          address: null,
          latitude: null,
          longitude: null,
          privacy: items[0].privacy,
        };

        await createPostFunc([replyPayload]);
        toast.success("Reply posted successfully");

        // Re-fetch or confirm?
        // Optimistic update should be fine.
        // In a real app we might replace the temp ID with real ID if we stored it,
        // but for now we rely on SWR or eventual refresh.
      } catch (error) {
        console.error("Reply creation failed", error);
        // Revert changes?
        // Since we don't have a direct "remove" callback easily accessible without props drilling or context,
        // we rely on the error toast. The user will see the error.
        // Ideally we should remove the optimistic post.
        // For now, users will refresh if they see it failed.
        // toast.error("Failed to post reply"); // createPostFunc context already sets error state/toast? No, context sets status='error'.
        // Context doesn't toast error message automatically? It renders Global Progress Bar in Error state.
        // Behavior: Progress bar turns red "Uploading Failed". User clicks "Retry".
        // This is perfect.
      }
    })();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setMediaPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveMedia = () => {
    setSelectedFile(null);
    setMediaPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAudienceChange = (value: string) => {
    setItems((prev) =>
      prev.map((item, index) =>
        index === 0 ? { ...item, privacy: value as PrivacyType } : item,
      ),
    );
    setIsAudienceDialogOpen(false);
  };

  const handleEmojiClick = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const cursorPosition = textarea.selectionStart;
      const newText =
        newComment.substring(0, cursorPosition) +
        emoji +
        newComment.substring(cursorPosition);
      setNewComment(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          cursorPosition + emoji.length,
          cursorPosition + emoji.length,
        );
      }, 0);
    }
  };

  const getReplyContext = () => {
    if (replyToComment) {
      return {
        // text: `Replying to @${replyToComment.user?.username}`,
        text: (
          <>
            Replying to{" "}
            <span className="text-blue-500">
              @{replyToComment.user?.username}
            </span>
          </>
        ),
        content: replyToComment.caption,
        user: replyToComment.user,
        media: replyToComment.media,
      };
    }
    return {
      // text: `Replying to @${post?.user?.username}`,
      text: (
        <>
          Replying to{" "}
          <span className="text-blue-500">@{post.user.username}</span>
        </>
      ),
      content: post.caption,
      user: post?.user,
      media: post?.media,
    };
  };

  const replyContext = getReplyContext();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col !max-w-[600px] w-full p-0 rounded-[32px] overflow-hidden border border-white/5 bg-background shadow-2xl !top-[10%] !translate-y-0 [&>button:last-child]:hidden max-h-[85vh]">
        <div className="flex flex-col h-full p-4 pb-2">
          {/* Header: Replying to */}
          <p className="text-[15px] italic text-[#8E8E93] pb-4">
            Replying to{" "}
            <span className="text-[#1D4ED8] italic">
              @{replyContext.user?.username}
            </span>
          </p>
          {post && (
            <div className="border border-white/5 rounded-[24px] p-5 mb-5 bg-transparent flex justify-between items-start gap-1">
              <div>
                <div className="flex gap-4">
                  <CustomAvatar
                    src={replyContext.user?.profile_picture || ""}
                    name={replyContext.user?.name || ""}
                    className="size-12 border-none rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[15px] text-white">
                        {replyContext.user?.name}
                      </span>
                      {!!replyContext.user?.verified_status && (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5213 2.62368C11.3147 1.75287 12.6853 1.75287 13.4787 2.62368L14.4989 3.74339C14.8298 4.10657 15.3097 4.30533 15.8117 4.28747L17.3577 4.23246C18.5595 4.1897 19.5898 5.15545 19.6416 6.35651L19.7081 7.90225C19.7297 8.40366 19.9818 8.86801 20.3981 9.1462L21.6798 10.0028C22.6763 10.6687 22.9573 11.9904 22.3013 13.0044L21.457 14.3092C21.1832 14.7317 21.1212 15.2536 21.2872 15.7275L21.7981 17.1866C22.1953 18.3207 21.5714 19.5541 20.42 19.9575L18.9392 20.4764C18.4588 20.6447 18.0673 21.0029 17.867 21.4587L17.2505 22.8624C16.7712 23.9535 15.4802 24.4308 14.4101 23.9114L13.0336 23.2433C12.5869 23.0264 12.0632 23.0264 11.6164 23.2433L10.2399 23.9114C9.16979 24.4308 7.87883 23.9535 7.39951 22.8624L6.78301 21.4587C6.58266 21.0029 6.19121 20.6447 5.71078 20.4764L4.23 19.9575C3.07857 19.5541 2.4547 18.3207 2.85194 17.1866L3.36279 15.7275C3.52882 15.2536 3.46679 14.7317 3.19302 14.3092L2.34868 13.0044C1.6927 11.9904 1.97371 10.6687 2.97022 10.0028L4.25192 9.1462C4.66816 8.86801 4.92027 8.40366 4.9419 7.90225L5.00844 6.35651C5.06019 5.15545 6.09054 4.1897 7.29235 4.23246L8.83827 4.28747C9.34027 4.30533 9.82019 4.10657 10.1511 3.74339L11.2213 2.62368H10.5213V2.62368ZM15.8071 9.39088L10.5401 14.6579L8.19293 12.3107L7.01442 13.4893L10.5401 17.0149L16.9856 10.5694L15.8071 9.39088Z"
                            fill="#1D4ED8"
                          />
                        </svg>
                      )}
                      <span className="text-[14px] text-[#8E8E93] leading-none ml-1">
                        •
                      </span>
                      <span className="text-[14px] text-[#8E8E93]">
                        {replyToComment?.formatted_time ||
                          post.formatted_time ||
                          "just now"}
                      </span>
                    </div>
                    <div className="text-[15px] text-[#8E8E93] mt-0.5">
                      @{replyContext.user?.username}
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-6 mt-4">
                  <p className="flex-1 text-[16px] text-white/90 leading-relaxed whitespace-pre-wrap">
                    {replyContext.content?.split(" ").map((word, i) =>
                      word.startsWith("#") || word.startsWith("@") ? (
                        <span key={i} className="text-[#1D4ED8]">
                          {word}{" "}
                        </span>
                      ) : (
                        word + " "
                      ),
                    )}
                  </p>
                </div>
              </div>

              {replyContext.media?.[0] && (
                <div className="shrink-0 w-[125px] h-[125px] rounded-24 relative border border-white/5">
                  {replyContext.media[0].media_type === "image" ? (
                    <img
                      src={replyContext.media[0].media_url}
                      alt={replyContext.media[0].media_filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={replyContext.media[0].media_thumbnail}
                        alt={replyContext.media[0].media_filename}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <IoVideocamOutline className="text-white text-3xl" />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex gap-4">
                <CustomAvatar
                  src={user?.profile_picture || ""}
                  name={user?.name || ""}
                  className="size-12 border-none"
                />
                <div className="flex-1 flex flex-col">
                  <div className="flex flex-col leading-tight pt-1 gap-1">
                    <span className="font-bold text-[13px] text-white">
                      {user?.name}
                    </span>
                    <span className="text-[12px] text-[#8E8E93]">
                      @{user?.username}
                    </span>
                  </div>
                </div>
              </div>
              {/* <textarea
                ref={textareaRef}
                className="w-full bg-transparent resize-none text-white text-[15px] font-normal placeholder-[#48484A] focus:outline-none min-h-[120px] mt-2"
                placeholder="Reply to post"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
              /> */}
              <div className="relative w-full min-h-[80px] mt-4">
                {/* Highlight Overlay */}
                <div
                  className="absolute inset-x-0 top-0 pointer-events-none text-[15px] font-normal whitespace-pre-wrap break-words p-0 m-0 z-0 text-white"
                  aria-hidden="true"
                >
                  {!newComment ? (
                    <span className="text-[#48484A]">Reply to post</span>
                  ) : (
                    newComment.split(/(\s+)/).map((part, i) => {
                      if (/^@[\w\d_]+/.test(part) || /^#[\w\d_]+/.test(part)) {
                        return <span key={i} className="text-[#0A84FF]">{part}</span>;
                      }
                      return <span key={i}>{part}</span>;
                    })
                  )}
                  {/* trailing newline fix for accurate height matching */}
                  {newComment.endsWith('\n') && <br />}
                </div>

                {/* Actual Input */}
                <textarea
                  value={newComment}
                  onChange={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;

                    const val = e.target.value;
                    const lastChar = val.slice(-1);

                    // Auto trigger modals
                    if (lastChar === "@") {
                      setIsMentionsOpen(true);
                      setNewComment(val.slice(0, -1));
                      return;
                    } else if (lastChar === "#") {
                      setIsHashtagsOpen(true);
                      setNewComment(val.slice(0, -1));
                      return;
                    }

                    setNewComment(val);
                  }}
                  onFocus={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  className="relative w-full h-full min-h-[80px] resize-none bg-transparent text-[15px] font-normal text-transparent caret-white outline-none border-none ring-0 focus:ring-0 p-0 m-0 z-10 overflow-hidden"
                  maxLength={500}
                  spellCheck={false}
                />
              </div>
            </div>
            {mediaPreviewUrl && selectedFile && (
              <div className="relative w-[125px] h-[125px] rounded-24 overflow-hidden bg-black/40 group border-2 mt-6">
                {selectedFile.type.startsWith("image/") ? (
                  <img
                    src={mediaPreviewUrl}
                    alt="Media preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={mediaPreviewUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 bg-transparent border-2 border-red-600 rounded-full p-1 shadow-lg transition-colors z-10"
                >
                  <IoClose size={16} className="text-red-600" />
                </button>
              </div>
            )}
          </div>

          {/* Toolbar */}
          {/* <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-6">
              <button className="text-[#8E8E93] hover:text-white transition-colors">
                <Smile size={24} strokeWidth={1.5} />
              </button>
              <label
                className={`transition-colors ${selectedFile ? "cursor-not-allowed opacity-30 text-gray-600" : "cursor-pointer text-[#8E8E93] hover:text-white"}`}
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={!!selectedFile}
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </label>
              <button className="text-[#8E8E93] hover:text-white transition-colors">
                <IoLocationSharp size={24} />
              </button>
            </div>
            <span className="text-[15px] text-[#48484A] font-medium">
              {charCount}/500
            </span>
          </div> */}
          <div className="flex items-center gap-3 pt-1">
            <label className="cursor-pointer text-[#8E8E93] hover:text-white transition-colors">
              <input type="file" accept="image/*,video/*" className="hidden" />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              {/* <TbPhoto size={20} /> */}
            </label>
            {/* Location */}
            {/* <div className="cursor-pointer text-[#8E8E93] hover:text-white transition-colors">
              <IoLocationSharp size={20} />
            </div> */}
            <div className="cursor-pointer text-[#8E8E93] hover:text-white transition-colors">
              <VscMention size={20} />
            </div>
            <div
              className="cursor-pointer text-[#8E8E93] hover:text-white transition-colors"
            // onClick={() => setActiveHashtagItemIndex(idx)}
            >
              <FiHash size={20} />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 pb-8 flex items-center justify-between border-t border-white/5">
          <button
            onClick={() => setIsAudienceDialogOpen(true)}
            className="flex items-center gap-3 text-white/90 font-bold px-0 py-2 rounded-2xl transition-all"
          >
            <div className="flex items-center gap-2">
              <Users size={22} className="stroke-[2.5]" />
              <span className="text-[16px] capitalize">
                {items[0].privacy === "only_me" ? "Only Me" : items[0].privacy}
              </span>
              <FaAngleRight
                size={16}
                className={
                  isAudienceDialogOpen
                    ? "rotate-180 transition-transform opacity-60"
                    : "transition-transform opacity-60"
                }
              />
            </div>
          </button>

          <button
            onClick={createReplyFunc}
            disabled={isReplyButtonDisabled || isLoading}
            className={`px-12 h-[56px] rounded-full font-bold text-[17px] text-white transition-all shadow-xl shadow-blue-900/10 ${isReplyButtonDisabled || isLoading
              ? "bg-[#094DB5BF] cursor-not-allowed opacity-50"
              : "bg-[#102A51] hover:bg-[#153a70]"
              }`}
          >
            {isLoading ? "Posting..." : "Reply"}
          </button>
        </div>

        {/* New Audience Selection Overlay */}
        {isAudienceDialogOpen && (
          <div className="absolute inset-0 bg-background z-[60] flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
              <div className="w-8" /> {/* Spacer */}
              <h3 className="text-[18px] font-bold text-white">Audience</h3>
              <button
                onClick={() => setIsAudienceDialogOpen(false)}
                className="p-1 hover:bg-white/5 rounded-full transition-colors"
              >
                <IoClose className="text-white size-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <RadioGroup
                value={items[0].privacy}
                onValueChange={handleAudienceChange}
                className="space-y-4"
              >
                {/* Everyone */}
                <div
                  className="flex items-center justify-between cursor-pointer group p-4 rounded-2xl hover:bg-white/5 transition-all"
                  onClick={() => handleAudienceChange("everyone")}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
                      <LiaGlobeAmericasSolid size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-[17px]">
                        Everyone
                      </span>
                      <span className="text-[14px] text-[#8E8E93] font-medium leading-tight">
                        Choosing 'Everyone' makes your <br /> posts visible to
                        all.
                      </span>
                    </div>
                  </div>
                  <RadioGroupItem
                    value="everyone"
                    id="everyone"
                    className="size-6 rounded-full border-2 border-[#3A3A3C] data-[state=checked]:border-[#1D4ED8] data-[state=checked]:bg-[#1D4ED8] relative flex items-center justify-center after:content-[''] after:block after:size-2.5 after:rounded-full after:bg-white after:opacity-0 data-[state=checked]:after:opacity-100 transition-all"
                  />
                </div>

                {/* Friends / Followers */}
                <div
                  className="flex items-center justify-between cursor-pointer group p-4 rounded-2xl hover:bg-white/5 transition-all"
                  onClick={() => handleAudienceChange("followers")}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
                      <Users size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-[17px]">
                        Friends / Followers
                      </span>
                      <span className="text-[14px] text-[#8E8E93] font-medium leading-tight">
                        Choosing this option limits your <br /> posts to your
                        friends or followers.
                      </span>
                    </div>
                  </div>
                  <RadioGroupItem
                    value="followers"
                    id="followers"
                    className="size-6 rounded-full border-2 border-[#3A3A3C] data-[state=checked]:border-[#1D4ED8] data-[state=checked]:bg-[#1D4ED8] relative flex items-center justify-center after:content-[''] after:block after:size-2.5 after:rounded-full after:bg-white after:opacity-0 data-[state=checked]:after:opacity-100 transition-all"
                  />
                </div>

                {/* Only Me */}
                <div
                  className="flex items-center justify-between cursor-pointer group p-4 rounded-2xl hover:bg-white/5 transition-all"
                  onClick={() => handleAudienceChange("only_me")}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
                      <Lock size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-[17px]">
                        Only Me
                      </span>
                      <span className="text-[14px] text-[#8E8E93] font-medium leading-tight">
                        Only you can see this post
                      </span>
                    </div>
                  </div>
                  <RadioGroupItem
                    value="only_me"
                    id="only_me"
                    className="size-6 rounded-full border-2 border-[#3A3A3C] data-[state=checked]:border-[#1D4ED8] data-[state=checked]:bg-[#1D4ED8] relative flex items-center justify-center after:content-[''] after:block after:size-2.5 after:rounded-full after:bg-white after:opacity-0 data-[state=checked]:after:opacity-100 transition-all"
                  />
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Action Modals */}
        <MentionsModal
          open={isMentionsOpen}
          onClose={() => setIsMentionsOpen(false)}
          onSelectUser={handleSelectMention}
        />
        <HashtagsModal
          open={isHashtagsOpen}
          onClose={() => setIsHashtagsOpen(false)}
          onSelectHashtag={handleSelectHashtag}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReplyModal;
