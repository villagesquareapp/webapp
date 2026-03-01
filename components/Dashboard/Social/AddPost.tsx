"use client";

import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { Label } from "components/ui/label";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useRef, useState, useEffect } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowDropright } from "react-icons/io";
import { IoClose, IoLocationSharp, IoVideocamOutline } from "react-icons/io5";
import { LiaGlobeAmericasSolid } from "react-icons/lia";
import { TbPhoto, TbPlus } from "react-icons/tb";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "sonner";
import Map from "../Reusable/Map";
import NewSocialField from "./NewSocialField";
import SparkMD5 from "spark-md5";
import ProgressBar from "./ProgressBar";
import { BookImage, Users, Lock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

import { usePostUploadContext } from "context/PostUploadContext";
import { set } from "zod";
import { useAddPost } from "context/AddPostContext";
import { FaAngleRight } from "react-icons/fa";

const ReactCrop = dynamic(() => import("react-image-crop"), { ssr: false });

type PrivacyType = "everyone" | "followers" | "only_me" | string;

const MAX_FILES = 5;

interface DraftItem {
  id: string;
  caption: string;
  media: File[];
  address: string;
  latitude: string;
  longitude: string;
  privacy: PrivacyType;
}

const AddPost = ({
  user,
  onRefreshPosts,
}: {
  user: IUser;
  onRefreshPosts: () => void;
}) => {
  const { isAddPostOpen, closeAddPost } = useAddPost();
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] =
    useState<boolean>(false);

  // Sync with context
  useEffect(() => {
    if (isAddPostOpen) {
      setIsNewPostDialogOpen(true);
    }
  }, [isAddPostOpen]);

  const handleDialogChange = (open: boolean) => {
    setIsNewPostDialogOpen(open);
    if (!open) {
      closeAddPost();
    }
  };

  const {
    isPosting,
    uploadProgress,
    uploadFileAndGetInfo,
    createPostFunc: apiCreatePost,
  } = usePostUploadContext();

  const [imageEditing, setImageEditing] = useState<boolean>(false);
  const [imagePreviewing, setImagePreviewing] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{
    type: "new" | "edit";
    postIndex: number | null;
    file: File | null;
  }>({
    type: "new",
    postIndex: null,
    file: null,
  });
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<any>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    unit: "%",
  });
  const [completedCrop, setCompletedCrop] = useState<any | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

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

  const addThreadItem = () =>
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        caption: "",
        media: [],
        address: "",
        latitude: "",
        longitude: "",
        privacy: prev[prev.length - 1]?.privacy ?? "everyone",
      },
    ]);

  const removeThreadItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (index: number, patch: Partial<DraftItem>) =>
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );

  const handleChangePostImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    postIndex: number,
  ) => {
    e.stopPropagation();
    if (!e.target.files?.[0]) return;
    if (items[postIndex].media.length >= MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files reached`);
      return;
    }

    const file = e.target.files[0];
    updateItem(postIndex, {
      media: [...items[postIndex].media, file],
    });
  };

  const handleFileFromNewSocialField = (file: File) => {
    const postIndex = 0;
    if (items[postIndex].media.length >= MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files reached`);
      return;
    }
    updateItem(postIndex, {
      media: [...items[postIndex].media, file],
    });
  };

  const handleExistingImageClick = (
    file: File,
    postIndex: number,
    fileIndex: number,
  ) => {
    setPreviewImage({ type: "edit", postIndex, file });
    setImagePreviewing(true);
    setImageEditing(false);
  };

  const handleRemovePostImage = (postIndex: number, fileIndex?: number) => {
    if (typeof fileIndex === "number") {
      updateItem(postIndex, {
        media: items[postIndex].media.filter((_, i) => i !== fileIndex),
      });
    } else {
      setPreviewImage({ type: "new", postIndex: null, file: null });
      setCroppedImageUrl(null);
      setImagePreviewing(false);
      setImageEditing(false);
    }
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    cropArea: { x: number; y: number; width: number; height: number },
  ) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2d context");

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height,
    );

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const currentFile = previewImage.file;
        if (!currentFile) {
          resolve(null);
          return;
        }
        const croppedFile = new File([blob], currentFile.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        setCroppedImageUrl(URL.createObjectURL(blob));
        resolve(croppedFile);
      }, "image/jpeg");
    });
  };

  const handleDoneEditing = async () => {
    if (!imgRef.current || !completedCrop || !previewImage.file) return;
    try {
      const croppedFile = await getCroppedImg(imgRef.current, completedCrop);
      if (croppedFile) {
        setPreviewImage({ ...previewImage, file: croppedFile });
        setImageEditing(false);
        setImagePreviewing(true);
      }
    } catch (e) {
      console.error("Error cropping image:", e);
      toast.error("Image crop failed");
    }
  };

  const localCreatePostFunc = async () => {
    const validation = validateDraft();
    if (validation) {
      toast.error(validation);
      return;
    }

    handleDialogChange(false);

    const currentItems = [...items];

    // Reset form immediately
    setItems([
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

    (async () => {
      try {
        const payloadPosts: any[] = [];

        for (let pIndex = 0; pIndex < currentItems.length; pIndex++) {
          const it = currentItems[pIndex];
          const uploadedFiles: { key: string; mime_type: string }[] = [];

          for (let fIndex = 0; fIndex < it.media.length; fIndex++) {
            const file = it.media[fIndex];
            const fileId = `${pIndex}-${file.name}-${fIndex}-${Date.now()}`;

            try {
              const fileInfo = await uploadFileAndGetInfo(file, fileId);
              uploadedFiles.push(fileInfo);
            } catch (err) {
              console.error(
                "Error uploading file for post",
                pIndex,
                file.name,
                err,
              );
              toast.error(`Failed to upload: ${file.name}`);
              // setIsPostInitiated(false);
              return;
            }
          }

          payloadPosts.push({
            media: uploadedFiles.length ? uploadedFiles : undefined,
            caption: it.caption,
            address: it.address || null,
            latitude: it.latitude ? Number(it.latitude) : null,
            longitude: it.longitude ? Number(it.longitude) : null,
            privacy: it.privacy,
          });
        }

        const result = await apiCreatePost(payloadPosts);

        if (result) {
          toast.success("Post created successfully");
          onRefreshPosts();
        } else {
          toast.error("Failed to create post");
        }
      } catch (err) {
        console.error("createPostFunc error", err);
        toast.error("Failed to create post");
      }
    })();
  };

  const handleAudienceChange = (value: string) => {
    setItems((prev) =>
      prev.map((item, index) =>
        index === 0 ? { ...item, privacy: value as PrivacyType } : item,
      ),
    );
    setIsAudienceDialogOpen(false);
  };

  const validateDraft = (): string | null => {
    if (!items.length) return "Add at least one post";
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.caption.trim() && it.media.length === 0)
        return `Post ${i + 1} needs caption or media`;
      if (it.caption.length > 500)
        return `Post ${i + 1} caption exceeds 500 characters`;
      if (it.media.length > MAX_FILES)
        return `Post ${i + 1} exceed maximum files`;
    }
    return null;
  };

  const canAddMorePost = useMemo(() => {
    return items.some(
      (it) => it.caption.trim().length > 0 || it.media.length > 0,
    );
  }, [items]);

  return (
    <>
      <NewSocialField
        user={user}
        openNewPostDialog={() => setIsNewPostDialogOpen(true)}
        addImage={handleFileFromNewSocialField}
      />

      <Dialog open={isNewPostDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="flex flex-col !max-w-[650px] w-full p-0 rounded-[32px] overflow-hidden border bg-background shadow-2xl !top-[10%] !translate-y-0 [&>button:last-child]:hidden min-h-[400px]">
          {!imagePreviewing && !imageEditing && (
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-4">
              {/* Threaded Post Boxes */}
              <div className="space-y-4">
                {items.map((it, idx) => (
                  <div
                    key={it.id}
                    className="relative border border-white/10 rounded-2xl p-6 bg-transparent"
                  >
                    {/* Inner Header: User Profile and Close Button */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <CustomAvatar
                          src={user?.profile_picture}
                          name={user?.name}
                          className="size-10 border-0"
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-[15px] text-white font-bold leading-tight tracking-wide">
                            {user?.name?.split(" ")[0].toUpperCase()}
                          </p>
                          <p className="text-[13px] text-[#8E8E93] font-medium leading-tight">
                            @{user?.username}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (idx === 0) {
                            handleDialogChange(false);
                          } else {
                            removeThreadItem(idx);
                          }
                        }}
                        className="p-1 hover:bg-white/5 rounded-full transition-colors"
                      >
                        <IoClose className="text-white size-5 opacity-80" />
                      </button>
                    </div>

                    <textarea
                      value={it.caption}
                      onChange={(e) =>
                        updateItem(idx, { caption: e.target.value })
                      }
                      placeholder="What's on your mind?"
                      className="w-full resize-none bg-transparent text-[15px] font-normal text-white placeholder:text-[#48484A] min-h-[80px] outline-none border-none ring-0 focus:ring-0 px-0"
                      maxLength={500}
                    />

                    {/* Post Media Previews */}
                    <div className="mt-4 flex flex-wrap gap-4 mb-3">
                      {it.media.map((file, fIdx) => (
                        <div
                          key={fIdx}
                          className={`relative w-[130px] h-[150px] rounded-2xl overflow-hidden bg-black/40 group ${
                            fIdx === it.media.length - 1
                              ? "border-2"
                              : ""
                          }`}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleRemovePostImage(idx, fIdx)}
                            className="absolute top-2 right-2 bg-transparent border-2 border-red-600 rounded-full p-1 shadow-lg transition-colors z-10"
                          >
                            <IoClose size={14} className="text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Toolbar within each item */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        {/* Emoji Toggle */}
                        <button className="text-[#8E8E93] hover:text-white transition-colors">
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
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                          </svg>
                        </button>

                        {/* Media Upload */}
                        <label className="cursor-pointer text-[#8E8E93] hover:text-white transition-colors">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => handleChangePostImage(e, idx)}
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
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                          {/* <TbPhoto size={20} /> */}
                        </label>

                        {/* Location */}
                        <div className="cursor-pointer text-[#8E8E93] hover:text-white transition-colors">
                          <IoLocationSharp size={20} />
                        </div>
                      </div>

                      <div className="text-[13px] text-[#48484A] font-semibold">
                        {it.caption.length}/500
                      </div>
                    </div>

                    {/* Location Display */}
                    {it.address && (
                      <div className="mt-2 text-[13px] text-[#8E8E93] font-medium">
                        {it.address}
                      </div>
                    )}
                  </div>
                ))}

                {canAddMorePost && (
                  <button
                    onClick={addThreadItem}
                    className="flex items-center gap-2 text-[14px] text-[#8E8E93] hover:text-white transition-colors pt-2 font-normal"
                  >
                    <TbPlus
                      size={20}
                      className="border border-[#8E8E93] rounded-full p-0.5"
                    />
                    Add more to post
                  </button>
                )}
              </div>

              {/* Footer: Audience and Post Actions */}
              <div className="mt-20 flex items-center justify-between">
                <button
                  onClick={() => setIsAudienceDialogOpen(true)}
                  className="flex items-center gap-3 text-white/90 font-bold px-0 py-2 rounded-2xl transition-all"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span className="text-[16px] capitalize">
                      {items[0].privacy === "only_me"
                        ? "Only Me"
                        : items[0].privacy}
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

                <Button
                  onClick={localCreatePostFunc}
                  disabled={!canAddMorePost || isPosting}
                  className="bg-[#094DB5BF] hover:bg-[#094DB5] text-white px-12 h-[50px] rounded-full font-bold text-[16px] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                >
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          )}

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

              <div className="flex-1 overflow-y-auto p-4">
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
                    <div className="flex items-center justify-between gap-4">
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddPost;
