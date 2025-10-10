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
} from "lucide-react";
import { useState, useMemo, useRef, useCallback } from "react";
import { IoVideocamOutline } from "react-icons/io5";
import { toast } from "sonner";
import { createPost } from "api/post";
import { usePostUploader } from "src/hooks/usePostUploader";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "@radix-ui/react-label";
import { LiaGlobeAmericasSolid } from "react-icons/lia";
import { IoIosArrowDown } from "react-icons/io";
import { Dispatch, SetStateAction } from "react";

interface ReplyModalProps {
  post: IPost;
  user: IUser;
  open: boolean;
  onClose: () => void;
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  onReplySuccess?: (newReply: IPostComment) => void;
  replyToComment?: IPostComment | null;
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

  const [items, setItems] = useState<DraftItem[]>([
    {
      id: String(Date.now()),
      caption: "",
      media: [],
      address: "",
      latitude: "",
      longitude: "",
      privacy: "everyone",
    },
  ]);

  const { isPosting, uploadProgress, uploadFileAndGetInfo } = usePostUploader();

  const createReplyFunc = async () => {
    if (!post?.uuid || isReplyButtonDisabled) return;

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
        privacy: "everyone",
      };
      setIsLoading(true);
      const result = await createPost({ posts: [replyPayload] });

      if (result?.status && result?.data) {
        toast.success("Reply created successfully");
        // onReplySuccess();
        // const newReply: IPostComment = {
        //   uuid: result.data?.uuid || `temp-${Date.now()}`,
        //   caption: newComment,
        //   user: {
        //     uuid: user.uuid,
        //     name: user.name,
        //     username: user.username,
        //     profile_picture: user.profile_picture,
        //   },
        //   likes_count: "0",
        //   replies_count: "0",
        //   is_liked: false,
        //   is_saved: false,
        //   formatted_time: "now",
        //   media: uploadedFiles.length > 0 ? [] : [], // You might want to construct media objects here
        //   created_at: new Date(),
        // };
        const newReply: IPostComment = {
          uuid: result.data?.uuid || `temp-${Date.now()}`,
          caption: newComment,
          user_id: user.uuid, // required by IPostComment
          parent_post_id: "", // set appropriately if available
          root_post_id: "", // set appropriately if available
          quote_post_id: null,
          thread_id: "",
          address: null,
          latitude: null,
          longitude: null,
          privacy: "everyone",
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
          media: uploadedFiles.length > 0 ? [] : [],

          // ✅ Now fill user with all required fields from IPostUser
          user: {
            uuid: user.uuid,
            name: user.name,
            username: user.username,
            profile_picture: user.profile_picture,
            email: user.email ?? "", // fallback if not available
            verified_status: user.verified_status ?? 0,
            checkmark_verification_status:
              user.checkmark_verification_status ?? false,
            premium_verification_status:
              user.premium_verification_status ?? false,
            online: user.online ?? false,
          },
        };

        if (onReplySuccess) {
          onReplySuccess(newReply);
        }

        setNewComment("");
        setSelectedFile(null);
        setMediaPreviewUrl(null);
        onClose();
        setPosts((prev) =>
          prev.map((p) =>
            p.uuid === post.uuid
              ? {
                  ...p,
                  replies_count: (Number(p.replies_count) + 1).toString(),
                }
              : p
          )
        );
        setIsLoading(false);
      } else {
        toast.error(result?.message || "Failed to create reply");
      }
    } catch (error) {
      toast.error("Failed to create reply");
      console.error("Reply creation error:", error);
    } finally {
      setIsLoading(false);
    }
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
        index === 0 ? { ...item, privacy: value as PrivacyType } : item
      )
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
          cursorPosition + emoji.length
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
      text:(
        <>
          Replying to {" "}
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
      <DialogContent className="sm:max-w-xl md:max-w-2xl bg-background p-0 rounded-2xl border-gray-800 flex flex-col max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-4 relative">
          <DialogTitle className="text-center text-white text-lg font-semibold"></DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <p className="text-sm text-gray-400 py-4 italic">
            {/* Replying to{" "}
            <span className="font-semibold text text-[#094DB5]">
              @{post?.user?.username}
            </span> */}
            {replyContext.text}
          </p>
          {post && (
            <div className="flex flex-col gap-3 mb-4 border-b border-gray-800 pb-4">
              <div className="flex gap-3">
                <CustomAvatar
                  src={replyContext.user?.profile_picture || ""}
                  name={replyContext.user?.name || ""}
                  className="size-10 border-foreground border-[1.5px]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">
                      {replyContext.user?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      @{replyContext.user?.username} ·{" "}
                      {replyToComment?.formatted_time ||
                        post.formatted_time ||
                        "just now"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 mt-2">
                    <p className="flex-1 text-sm text-gray-200">
                      {replyContext.content}
                    </p>
                    {replyContext.media?.[0] && (
                      <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden relative">
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
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <CustomAvatar
              src={user?.profile_picture || ""}
              name={user?.name || ""}
              className="size-10 border-foreground border-[1.5px]"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-400">@{user?.username}</span>
              </div>
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent resize-none text-white text-base placeholder-gray-500 focus:outline-none h-24 mt-2"
                placeholder="Add a reply..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
              />
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2 pl-10">
            <div className="flex justify-between items-center text-gray-400">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:text-white transition"
                >
                  <ImageIcon size={20} />
                </button>
                <button className="hover:text-white transition">
                  <MapPin size={20} />
                </button>
              </div>
            </div>
            <span
              className={`text-sm ${
                charCount > 500 ? "text-red-500" : "text-gray-400"
              }`}
            >
              {charCount}/500
            </span>
          </div>
          {mediaPreviewUrl && selectedFile && (
            <div className="relative w-40 h-40 rounded-lg overflow-hidden mt-4">
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
                className="absolute top-2 right-2 bg-gray-800/50 hover:bg-gray-800 p-1 rounded-full text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex gap-16">
              <button
                onClick={() => handleEmojiClick("👍")}
                className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
              >
                👍
              </button>
              <button
                onClick={() => handleEmojiClick("❤️")}
                className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
              >
                ❤️
              </button>
              <button
                onClick={() => handleEmojiClick("👏")}
                className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
              >
                👏
              </button>
              <button
                onClick={() => handleEmojiClick("😊")}
                className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
              >
                😊
              </button>
              <button
                onClick={() => handleEmojiClick("😐")}
                className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
              >
                😐
              </button>
              <button
                onClick={() => handleEmojiClick("🤩")}
                className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
              >
                🤩
              </button>
              <button
                onClick={() => handleEmojiClick("😢")}
                className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
              >
                😢
              </button>
            </div>
          </div>

          <div className="bg-background border-b border-white/6 px-4 py-4">
            <div className="gap-y-1 flex flex-col">
              <div
                onClick={() => setIsAudienceDialogOpen(!isAudienceDialogOpen)}
                className="flex flex-row justify-between cursor-pointer"
              >
                <div className="flex flex-row gap-x-2 items-center">
                  <div className="bg-accent p-1.5 text-sm rounded-sm w-fit h-fit">
                    <LiaGlobeAmericasSolid className="size-5" />
                  </div>
                  <p className="">Audience</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="text-sm text-muted-foreground capitalize">
                    {items[0].privacy}
                  </span>
                  <IoIosArrowDown
                    className={`size-5 duration-500 transition-transform ${
                      isAudienceDialogOpen ? "-rotate-180 " : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {isAudienceDialogOpen && (
            <RadioGroup
              value={
                items[0].privacy === "everyone"
                  ? "default"
                  : items[0].privacy === "followers"
                  ? "comfortable"
                  : "private"
              }
              onValueChange={handleAudienceChange}
              className="flex flex-col gap-y-4 mt-1 ml-10"
            >
              <div
                className="flex justify-between w-full cursor-pointer"
                onClick={() => handleAudienceChange("everyone")}
              >
                <div className="flex flex-col gap-y-1 w-full">
                  <div className="flex flex-row gap-x-2 items-center justify-between">
                    <p className="font-semibold">Everyone</p>
                    <div>
                      <RadioGroupItem
                        className="size-5"
                        value="default"
                        id="r1"
                      />
                      <Label htmlFor="r1" />
                    </div>
                  </div>
                  <p className="text-sm font-light">
                    Choosing 'Everyone' makes your posts visible to all.
                  </p>
                </div>
              </div>
              <div
                className="flex justify-between w-full cursor-pointer"
                onClick={() => handleAudienceChange("followers")}
              >
                <div className="flex flex-col gap-y-1 w-full">
                  <div className="flex flex-row gap-x-2 items-end justify-between">
                    <p className="font-semibold">Friends/Followers</p>
                    <div>
                      <RadioGroupItem
                        className="size-5"
                        value="comfortable"
                        id="r2"
                      />
                      <Label htmlFor="r2" />
                    </div>
                  </div>
                  <p className="text-sm font-light">
                    Choosing 'Friends/Followers' limits your posts to your
                    friends or followers.{" "}
                  </p>
                </div>
              </div>
            </RadioGroup>
          )}

          <button
            onClick={createReplyFunc}
            disabled={isReplyButtonDisabled || isLoading}
            className={`w-full py-3 rounded-full font-semibold text-white transition-colors duration-200 ${
              isReplyButtonDisabled || isLoading
                ? "bg-blue-800 cursor-not-allowed opacity-50"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Posting..." : "Post Reply"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyModal;

// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "components/ui/dialog";
// import CustomAvatar from "components/ui/custom/custom-avatar";
// import {
//   SendHorizonal,
//   Image as ImageIcon,
//   MapPin,
//   Smile,
//   X,
// } from "lucide-react";
// import { useState, useMemo, useRef, useCallback } from "react";
// import { IoVideocamOutline } from "react-icons/io5";
// import { toast } from "sonner";
// import { createPost } from "api/post";

// // Import the custom hook
// import { usePostUploader } from "src/hooks/usePostUploader";
// import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
// import { Label } from "@radix-ui/react-label";
// import { LiaGlobeAmericasSolid } from "react-icons/lia";
// import { IoIosArrowDown } from "react-icons/io";

// interface ReplyModalProps {
//   isOpen: boolean;
//   onClose: (open: boolean) => void;
//   replyingTo: IPost | IPostComment | null;
//   newComment: string;
//   setNewComment: (comment: string) => void;
//   user: IUser;
//   onPostReply: (mediaFile: File | null) => void;
//     onPostReplySuccess: () => void;
//   //   postCommentLoading: boolean;
// }

// interface DraftItem {
//   id: string;
//   caption: string;
//   media: File[];
//   address: string;
//   latitude: string;
//   longitude: string;
//   privacy: PrivacyType;
// }

// const ReplyModal = ({
//   isOpen,
//   onClose,
//   replyingTo,
//   newComment,
//   setNewComment,
//   user,
//   onPostReply,
//   onPostReplySuccess,
// }: ReplyModalProps) => {
//   const charCount = newComment.length;
//   const isReplyButtonDisabled = useMemo(() => {
//     return !newComment.trim() || charCount > 500;
//   }, [newComment, charCount]);

//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
//   const [isAudienceDialogOpen, setIsAudienceDialogOpen] =
//     useState<boolean>(false);

//   const [items, setItems] = useState<DraftItem[]>([
//     {
//       id: String(Date.now()),
//       caption: "",
//       media: [],
//       address: "",
//       latitude: "",
//       longitude: "",
//       privacy: "everyone",
//     },
//   ]);

//   // Use the new hook to manage post upload logic
//   const { isPosting, uploadProgress, uploadFileAndGetInfo } = usePostUploader();

//   const createReplyFunc = async () => {
//     try {
//       let uploadedFiles: { key: string; mime_type: string }[] = [];
//       if (selectedFile) {
//         const fileId = `${replyingTo?.uuid}-${Date.now()}`;
//         // Use the hook's function to handle the upload
//         const fileInfo = await uploadFileAndGetInfo(selectedFile, fileId);
//         uploadedFiles.push(fileInfo);
//       }

//       const replyPayload = {
//         media: uploadedFiles.length > 0 ? uploadedFiles : undefined,
//         caption: newComment,
//         parent_post_id: replyingTo?.uuid,
//         address: null,
//         latitude: null,
//         longitude: null,
//         privacy: "everyone",
//       };

//       const result = await createPost({ posts: [replyPayload] });

//       if (result?.status && result?.data) {
//         toast.success("Reply created successfully");
//         onPostReplySuccess();
//       } else {
//         toast.error(result?.message || "Failed to create reply");
//       }
//     } catch (error) {
//       toast.error("Failed to create reply");
//       console.error("Reply creation error:", error);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       setSelectedFile(file);
//       setMediaPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleRemoveMedia = () => {
//     setSelectedFile(null);
//     setMediaPreviewUrl(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleAudienceChange = (value: string) => {
//     setItems((prev) =>
//       prev.map((item, index) =>
//         index === 0 ? { ...item, privacy: value as PrivacyType } : item
//       )
//     );
//     setIsAudienceDialogOpen(false);
//   };

//   const handleEmojiClick = (emoji: string) => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       const cursorPosition = textarea.selectionStart;
//       const newText =
//         newComment.substring(0, cursorPosition) +
//         emoji +
//         newComment.substring(cursorPosition);
//       setNewComment(newText);
//       setTimeout(() => {
//         textarea.focus();
//         textarea.setSelectionRange(
//           cursorPosition + emoji.length,
//           cursorPosition + emoji.length
//         );
//       }, 0);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-xl md:max-w-2xl bg-background p-0 rounded-2xl border-gray-800 flex flex-col max-h-[90vh] overflow-hidden">
//         <DialogHeader className="p-4 relative">
//           <DialogTitle className="text-center text-white text-lg font-semibold">
//           </DialogTitle>
//         </DialogHeader>

//         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//           <p className="text-sm text-gray-400 py-4 italic">
//             Replying to{" "}
//             <span className="font-semibold text text-[#094DB5]">
//               @{replyingTo?.user?.username}
//             </span>
//           </p>
//           {replyingTo && (
//             <div className="flex flex-col gap-3 mb-4 border-b border-gray-800 pb-4">
//               <div className="flex gap-3">
//                 <CustomAvatar
//                   src={replyingTo?.user?.profile_picture || ""}
//                   name={replyingTo?.user?.name || ""}
//                   className="size-10 border-foreground border-[1.5px]"
//                 />
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <span className="font-semibold text-sm text-white">
//                       {replyingTo?.user?.name}
//                     </span>
//                     <span className="text-xs text-gray-400">
//                       @{replyingTo?.user?.username} ·{" "}
//                       {replyingTo?.formatted_time || "just now"}
//                     </span>
//                   </div>
//                   <div className="flex items-start justify-between gap-2 mt-2">
//                     <p className="flex-1 text-sm text-gray-200">
//                       {replyingTo.caption}
//                     </p>
//                     {replyingTo?.media?.[0] && (
//                       <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden relative">
//                         {replyingTo.media[0].media_type === "image" ? (
//                           <img
//                             src={replyingTo.media[0].media_url}
//                             alt={replyingTo.media[0].media_filename}
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <>
//                             <img
//                               src={replyingTo.media[0].media_thumbnail}
//                               alt={replyingTo.media[0].media_filename}
//                               className="w-full h-full object-cover"
//                             />
//                             <div className="absolute inset-0 flex items-center justify-center bg-black/40">
//                               <IoVideocamOutline className="text-white text-3xl" />
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex gap-3">
//             <CustomAvatar
//               src={user?.profile_picture || ""}
//               name={user?.name || ""}
//               className="size-10 border-foreground border-[1.5px]"
//             />
//             <div className="flex-1 flex flex-col">
//               <div className="flex items-center gap-2">
//                 <span className="font-semibold text-sm text-white">
//                   {user?.name}
//                 </span>
//                 <span className="text-xs text-gray-400">@{user?.username}</span>
//               </div>
//               <textarea
//                 ref={textareaRef}
//                 className="w-full bg-transparent resize-none text-white text-base placeholder-gray-500 focus:outline-none h-24 mt-2"
//                 placeholder="Add a reply..."
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 maxLength={500}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="p-4 flex flex-col gap-3">
//           <div className="flex justify-between items-center mb-2 pl-10">
//             <div className="flex justify-between items-center text-gray-400">
//               <div className="flex items-center gap-4">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   accept="image/*,video/*"
//                   className="hidden"
//                 />
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="hover:text-white transition"
//                 >
//                   <ImageIcon size={20} />
//                 </button>
//                 <button className="hover:text-white transition">
//                   <MapPin size={20} />
//                 </button>
//               </div>
//             </div>
//             <span
//               className={`text-sm ${
//                 charCount > 500 ? "text-red-500" : "text-gray-400"
//               }`}
//             >
//               {charCount}/500
//             </span>
//           </div>
//           {mediaPreviewUrl && selectedFile && (
//             <div className="relative w-40 h-40 rounded-lg overflow-hidden mt-4">
//               {selectedFile.type.startsWith("image/") ? (
//                 <img
//                   src={mediaPreviewUrl}
//                   alt="Media preview"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <video
//                   src={mediaPreviewUrl}
//                   controls
//                   className="w-full h-full object-cover"
//                 />
//               )}
//               <button
//                 onClick={handleRemoveMedia}
//                 className="absolute top-2 right-2 bg-gray-800/50 hover:bg-gray-800 p-1 rounded-full text-white transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}
//           <div className="flex items-center justify-between">
//             <div className="flex gap-16">
//               <button
//                 onClick={() => handleEmojiClick("👍")}
//                 className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
//               >
//                 👍
//               </button>
//               <button
//                 onClick={() => handleEmojiClick("❤️")}
//                 className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
//               >
//                 ❤️
//               </button>
//               <button
//                 onClick={() => handleEmojiClick("👏")}
//                 className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
//               >
//                 👏
//               </button>
//               <button
//                 onClick={() => handleEmojiClick("😊")}
//                 className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
//               >
//                 😊
//               </button>
//               <button
//                 onClick={() => handleEmojiClick("😐")}
//                 className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
//               >
//                 😐
//               </button>
//               <button
//                 onClick={() => handleEmojiClick("🤩")}
//                 className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
//               >
//                 🤩
//               </button>
//               <button
//                 onClick={() => handleEmojiClick("😢")}
//                 className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
//               >
//                 😢
//               </button>
//             </div>
//           </div>

//           <div className="bg-background border-b border-white/6 px-4 py-4">
//             <div className="gap-y-1 flex flex-col">
//               <div
//                 onClick={() => setIsAudienceDialogOpen(!isAudienceDialogOpen)}
//                 className="flex flex-row justify-between cursor-pointer"
//               >
//                 <div className="flex flex-row gap-x-2 items-center">
//                   <div className="bg-accent p-1.5 text-sm rounded-sm w-fit h-fit">
//                     <LiaGlobeAmericasSolid className="size-5" />
//                   </div>
//                   <p className="">Audience</p>
//                 </div>
//                 <div className="flex items-center gap-x-2">
//                   <span className="text-sm text-muted-foreground capitalize">
//                     {items[0].privacy}
//                   </span>
//                   <IoIosArrowDown
//                     className={`size-5 duration-500 transition-transform ${
//                       isAudienceDialogOpen ? "-rotate-180 " : ""
//                     }`}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {isAudienceDialogOpen && (
//             <RadioGroup
//               value={
//                 items[0].privacy === "everyone"
//                   ? "default"
//                   : items[0].privacy === "followers"
//                   ? "comfortable"
//                   : "private"
//               }
//               onValueChange={handleAudienceChange}
//               className="flex flex-col gap-y-4 mt-1 ml-10"
//             >
//               <div
//                 className="flex justify-between w-full cursor-pointer"
//                 onClick={() => handleAudienceChange("everyone")}
//               >
//                 <div className="flex flex-col gap-y-1 w-full">
//                   <div className="flex flex-row gap-x-2 items-center justify-between">
//                     <p className="font-semibold">Everyone</p>
//                     <div>
//                       <RadioGroupItem
//                         className="size-5"
//                         value="default"
//                         id="r1"
//                       />
//                       <Label htmlFor="r1" />
//                     </div>
//                   </div>
//                   <p className="text-sm font-light">
//                     Choosing 'Everyone' makes your posts visible to all.
//                   </p>
//                 </div>
//               </div>
//               <div
//                 className="flex justify-between w-full cursor-pointer"
//                 onClick={() => handleAudienceChange("followers")}
//               >
//                 <div className="flex flex-col gap-y-1 w-full">
//                   <div className="flex flex-row gap-x-2 items-end justify-between">
//                     <p className="font-semibold">Friends/Followers</p>
//                     <div>
//                       <RadioGroupItem
//                         className="size-5"
//                         value="comfortable"
//                         id="r2"
//                       />
//                       <Label htmlFor="r2" />
//                     </div>
//                   </div>
//                   <p className="text-sm font-light">
//                     Choosing 'Friends/Followers' limits your posts to your
//                     friends or followers.{" "}
//                   </p>
//                 </div>
//               </div>
//             </RadioGroup>
//           )}

//           <button
//             onClick={createReplyFunc}
//             disabled={isReplyButtonDisabled || isPosting}
//             className={`w-full py-3 rounded-full font-semibold text-white transition-colors duration-200 ${
//               isReplyButtonDisabled || isPosting
//                 ? "bg-blue-800 cursor-not-allowed opacity-50"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {isPosting ? "Posting..." : "Post Reply"}
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ReplyModal;

// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "components/ui/dialog";
// import CustomAvatar from "components/ui/custom/custom-avatar";
// import {
//   SendHorizonal,
//   Image as ImageIcon,
//   MapPin,
//   Smile,
//   X,
// } from "lucide-react"; // Import new icons
// import { useState, useMemo, useRef } from "react"; // Import useState and useMemo
// import { IoVideocamOutline } from "react-icons/io5";

// interface ReplyModalProps {
//   isOpen: boolean;
//   onClose: (open: boolean) => void;
//   replyingTo: IPost | IPostComment | null;
//   newComment: string;
//   setNewComment: (comment: string) => void;
//   user: IUser; // The current logged-in user
//   onPostReply: () => void;
//   //   postCommentLoading: boolean; // Added for loading state
// }

// const MAX_COMMENT_LENGTH = 500;
// const emojiList = ["👍", "❤️", "👏", "😊", "😐", "🤩", "😢"];

// const ReplyToPostModal = ({
//   isOpen,
//   onClose,
//   replyingTo,
//   newComment,
//   setNewComment,
//   user,
//   onPostReply,
// }: //   postCommentLoading,
// ReplyModalProps) => {
//   const charCount = newComment.length;
//   const isReplyButtonDisabled = useMemo(() => {
//     return !newComment.trim() || charCount > MAX_COMMENT_LENGTH;
//   }, [newComment, charCount]);

//   // Use a ref to get a reference to the textarea element
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   // Ref for the file input element
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // State for media selection and preview
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
//   const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

//   const handleEmojiClick = (emoji: string) => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       // Get the cursor position
//       const cursorPosition = textarea.selectionStart;

//       // Create the new comment string by inserting the emoji
//       const newText =
//         newComment.substring(0, cursorPosition) +
//         emoji +
//         newComment.substring(cursorPosition);
//       setNewComment(newText);

//       // Focus the textarea and set the new cursor position
//       // We use a small timeout to ensure the DOM has updated
//       setTimeout(() => {
//         textarea.focus();
//         textarea.setSelectionRange(
//           cursorPosition + emoji.length,
//           cursorPosition + emoji.length
//         );
//       }, 0);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       setSelectedFile(file);
//       setMediaPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleRemoveMedia = () => {
//     setSelectedFile(null);
//     setMediaPreviewUrl(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-xl md:max-w-2xl bg-background p-0 rounded-2xl border-gray-800 flex flex-col max-h-[90vh] overflow-hidden">
//         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//           <p className="text-sm text-gray-400 py-4 mt-5 italic">
//             Replying to{" "}
//             <span className="font-semibold text text-[#094DB5]">
//               @{replyingTo?.user?.username}
//             </span>
//           </p>
//           {/* Original Post/Comment being replied to */}
//           {replyingTo && (
//             <div className="flex gap-3 mb-4 border-b border-gray-800 pb-4">
//               <CustomAvatar
//                 src={replyingTo?.user?.profile_picture || ""}
//                 name={replyingTo?.user?.name || ""}
//                 className="size-10 border-foreground border-[1.5px]"
//               />
//               <div className="flex-1">
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold text-sm text-white">
//                     {replyingTo?.user?.name}
//                   </span>
//                   {/* Add verified badge if applicable */}
//                   {/* {replyingTo?.user?.is_verified && <CheckCircle className="w-4 h-4 text-blue-500" />} */}
//                   <span className="text-xs text-gray-400">
//                     · {replyingTo?.formatted_time}
//                   </span>
//                 </div>
//                 {/* Content of the post */}
//                 <div className="flex items-start justify-between gap-2 mt-2">
//                   {/* Caption */}
//                   <p className="flex-1 text-sm text-gray-200">
//                     {replyingTo.caption}
//                   </p>

//                   {/* Media (Showing only the first item) */}
//                   {replyingTo?.media?.[0] && (
//                     <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden relative">
//                       {replyingTo.media[0].media_type === "image" ? (
//                         <img
//                           src={replyingTo.media[0].media_url}
//                           alt={replyingTo.media[0].media_filename}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <>
//                           <img
//                             src={replyingTo.media[0].media_thumbnail}
//                             alt={replyingTo.media[0].media_filename}
//                             className="w-full h-full object-cover"
//                           />
//                           <div className="absolute inset-0 flex items-center justify-center bg-black/40">
//                             <IoVideocamOutline className="text-white text-3xl" />
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Current User's Reply Input Area */}
//           <div className="flex gap-3">
//             <CustomAvatar
//               src={user?.profile_picture || ""}
//               name={user?.name || ""}
//               className="size-10 border-foreground border-[1.5px]"
//             />
//             <div className="flex-1 flex flex-col">
//               <div className="flex items-center gap-2">
//                 <span className="font-semibold text-sm text-white">
//                   {user?.name}
//                 </span>
//                 <span className="text-xs text-gray-400">@{user?.username}</span>
//               </div>
//               <textarea
//                 ref={textareaRef}
//                 className="w-full bg-transparent resize-none text-white text-sm placeholder-gray-500 focus:outline-none h-24 mt-2"
//                 placeholder="Add a reply..."
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 maxLength={MAX_COMMENT_LENGTH}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons and Audience Selector */}
//         <div className="p-4 flex flex-col gap-3">
//           <div className="flex justify-between items-center text-gray-400">
//             <div className="flex items-center gap-4">
//               {/* This is the hidden file input */}
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept="image/*,video/*"
//                 className="hidden"
//               />
//               {/* This button triggers the file input */}
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="hover:text-white transition"
//               >
//                 <ImageIcon size={20} />
//               </button>
//               <button className="hover:text-white transition">
//                 <MapPin size={20} />
//               </button>
//             </div>
//             <span
//               className={`text-sm ${
//                 charCount > MAX_COMMENT_LENGTH
//                   ? "text-red-500"
//                   : "text-gray-400"
//               }`}
//             >
//               {charCount}/{MAX_COMMENT_LENGTH}
//             </span>
//           </div>

//           {/* Media Preview Section */}
//           {mediaPreviewUrl && selectedFile && (
//             <div className="relative w-40 h-40 rounded-lg overflow-hidden mt-4">
//               {selectedFile.type.startsWith("image/") ? (
//                 <img
//                   src={mediaPreviewUrl}
//                   alt="Media preview"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <video
//                   src={mediaPreviewUrl}
//                   className="w-full h-full object-cover"
//                 />
//               )}
//               <button
//                 onClick={handleRemoveMedia}
//                 className="absolute top-2 right-2 bg-gray-800/50 hover:bg-gray-800 p-1 rounded-full text-white transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}
//           {/* <div className="flex items-center justify-between">
//             <div className="flex gap-6 text-gray-400">
//               <button className="hover:text-white transition">
//                 <ImageIcon size={20} />
//               </button>
//               <button className="hover:text-white transition">
//                 <MapPin size={20} />
//               </button>
//             </div>
//             <span
//               className={`text-sm ${
//                 charCount > MAX_COMMENT_LENGTH
//                   ? "text-red-500"
//                   : "text-gray-400"
//               }`}
//             >
//               {charCount}/{MAX_COMMENT_LENGTH}
//             </span>
//           </div> */}

//           <div className="flex items-center justify-between">
//             {/* The emoji buttons */}
//             <div className="flex gap-16">
//               {emojiList.map((emoji) => (
//                 <button
//                   key={emoji}
//                   onClick={() => handleEmojiClick(emoji)}
//                   className="text-lg hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
//                 >
//                   {emoji}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center justify-between text-gray-400 text-sm">
//             <div className="flex items-center gap-2">
//               {/* Audience Icon */}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="lucide lucide-users"
//               >
//                 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                 <circle cx="9" cy="7" r="4" />
//                 <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//                 <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//               </svg>
//               Audience
//             </div>
//             <button className="flex items-center gap-1 text-blue-400 font-semibold">
//               Everyone
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="lucide lucide-chevron-right"
//               >
//                 <path d="m9 18 6-6-6-6" />
//               </svg>
//             </button>
//           </div>

//           <button
//             onClick={onPostReply}
//             disabled={isReplyButtonDisabled}
//             className={`w-full py-3 rounded-full font-semibold text-white transition-colors duration-200 ${
//               isReplyButtonDisabled
//                 ? "bg-blue-800 cursor-not-allowed opacity-50"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {"Post Reply"}
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ReplyToPostModal;
