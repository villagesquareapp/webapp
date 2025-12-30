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
import { useMemo, useRef, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose, IoVideocamOutline } from "react-icons/io5";
import { LiaGlobeAmericasSolid } from "react-icons/lia";
import { TbPlus } from "react-icons/tb";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "sonner";
import Map from "../Reusable/Map";
import NewSocialField from "./NewSocialField";
import SparkMD5 from "spark-md5";
import ProgressBar from "./ProgressBar";
import { BookImage } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

// Import the custom hook
import { usePostUploader } from "src/hooks/usePostUploader";
import { set } from "zod";

const ReactCrop = dynamic(() => import("react-image-crop"), { ssr: false });

type PrivacyType = "everyone" | "followers" | "private" | string;

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
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState<boolean>(false);
  const [isPostInitiated, setIsPostInitiated] = useState<boolean>(false);

  const {
    isPosting,
    uploadProgress,
    uploadFileAndGetInfo,
    createPostFunc: apiCreatePost,
  } = usePostUploader(user?.token);

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

    const overallProgress = useMemo(() => {
    const fileKeys = Object.keys(uploadProgress);
    if (fileKeys.length === 0) return 0;
    const totalProgress = fileKeys.reduce(
      (sum, key) => sum + (uploadProgress[key]?.progress || 0),
      0
    );
    return totalProgress / fileKeys.length;
  }, [uploadProgress]);

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
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it))
    );

  const handleChangePostImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    postIndex: number
  ) => {
    e.stopPropagation();
    if (!e.target.files?.[0]) return;
    if (items[postIndex].media.length >= MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files reached`);
      return;
    }

    const file = e.target.files[0];
    setPreviewImage({ type: "new", postIndex, file });
    setImagePreviewing(true);
    setImageEditing(false);
  };

  const handleFileFromNewSocialField = (file: File) => {
    const postIndex = 0;
    if (items[postIndex].media.length >= MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files reached`);
      return;
    }
    setPreviewImage({ type: "new", postIndex, file });
    setImagePreviewing(true);
    setImageEditing(false);
  };

  const handleExistingImageClick = (
    file: File,
    postIndex: number,
    fileIndex: number
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
    cropArea: { x: number; y: number; width: number; height: number }
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
      cropArea.height
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
    setIsPostInitiated(true)
    try {
      const validation = validateDraft();
      if (validation) {
        toast.error(validation);
        return;
      }

      const payloadPosts: any[] = [];

      for (let pIndex = 0; pIndex < items.length; pIndex++) {
        const it = items[pIndex];
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
              err
            );
            toast.error(`Failed to upload: ${file.name}`);
            setIsPostInitiated(false);
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
        setIsNewPostDialogOpen(false);
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
      } else {
        toast.error("Failed to create post");
      }
    } catch (err) {
      console.error("createPostFunc error", err);
      toast.error("Failed to create post");
    } finally {
      setIsPostInitiated(false)
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

  const handleCancelUpload = () => {
    setIsPostInitiated(false);
  };

  const canAddMorePost = useMemo(() => {
  return items.some(
    (it) => it.caption.trim().length > 0 || it.media.length > 0
  );
}, [items]);



  return (
    <>
      <NewSocialField
        user={user}
        openNewPostDialog={() => setIsNewPostDialogOpen(true)}
        addImage={handleFileFromNewSocialField}
      />

      {isPostInitiated && <ProgressBar progress={overallProgress} onCancel={handleCancelUpload} />}

      <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
        <DialogContent className="flex flex-col !max-w-[720px] w-full max-h-[90vh] p-0 rounded-2xl overflow-hidden">
          <DialogHeader className="sticky top-0 z-50 bg-background">
            <div className="flex items-center justify-between px-5 py-3">
              <button
                onClick={() => setIsNewPostDialogOpen(false)}
                className="p-2 rounded-full hover:bg-white/5"
              >
                <IoClose className="text-white/80" />
              </button>

              <DialogTitle className="text-lg font-semibold text-white">
                New Post
              </DialogTitle>

              <div style={{ width: 36 }} />
            </div>
          </DialogHeader>

          {imageEditing && previewImage.file && (
            <>
              <div className="flex-1 bg-black relative flex items-center justify-center p-4">
                <div className="absolute top-3 right-3 z-30">
                  <button
                    className="bg-white/6 p-2 rounded-md"
                    onClick={() => {
                      setImageEditing(false);
                      setImagePreviewing(false);
                      setPreviewImage({
                        type: "new",
                        postIndex: null,
                        file: null,
                      });
                    }}
                  >
                    <IoClose className="text-white" />
                  </button>
                </div>

                <div className="max-h-[70vh] w-full px-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(c: any) => setCrop(c)}
                    onComplete={(c: any) => setCompletedCrop(c)}
                    aspect={16 / 9}
                    className="mx-auto"
                  >
                    <img
                      ref={imgRef as any}
                      src={URL.createObjectURL(previewImage.file)}
                      alt="Crop"
                      className="max-h-[65vh] object-contain"
                    />
                  </ReactCrop>
                </div>
              </div>

              <div className="bg-background px-4 py-3">
                <Button onClick={handleDoneEditing} className="w-full h-[52px]">
                  Done
                </Button>
              </div>
            </>
          )}

          {imagePreviewing && previewImage.file && !imageEditing && (
            <>
              <div className="flex-1 p-4 overflow-auto">
                <div className="relative rounded-lg overflow-hidden bg-accent p-4">
                  <div className="absolute top-3 right-3">
                    <button
                      className="bg-white/6 p-2 rounded-md"
                      onClick={() =>
                        handleRemovePostImage(previewImage.postIndex ?? 0)
                      }
                    >
                      <IoClose className="text-white" />
                    </button>
                  </div>

                  {previewImage.file.type.includes("video") ? (
                    <video
                      src={URL.createObjectURL(previewImage.file)}
                      controls
                      autoPlay
                      muted
                      className="w-full rounded-md"
                    />
                  ) : (
                    <div className="relative w-full h-[50vh] rounded-md overflow-hidden">
                      <Image
                        src={
                          croppedImageUrl ||
                          URL.createObjectURL(previewImage.file)
                        }
                        alt="preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-background px-4 py-3 flex gap-3">
                {!previewImage.file.type.includes("video") && (
                  <Button
                    variant="outline"
                    onClick={() => setImageEditing(true)}
                    className="flex-1 h-[52px]"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => {
                    if (previewImage.postIndex === null) {
                      setImagePreviewing(false);
                      setPreviewImage({
                        type: "new",
                        postIndex: null,
                        file: null,
                      });
                      return;
                    }
                    const fileToAdd = previewImage.file!;
                    const targetIndex = previewImage.postIndex;
                    const existing = items[targetIndex].media;
                    if (existing.length >= MAX_FILES) {
                      toast.error(`Maximum ${MAX_FILES} files reached`);
                      return;
                    }
                    updateItem(targetIndex, {
                      media: [...existing, fileToAdd],
                    });
                    setImagePreviewing(false);
                    setPreviewImage({
                      type: "new",
                      postIndex: null,
                      file: null,
                    });
                    setCroppedImageUrl(null);
                  }}
                  className="flex-1 h-[52px]"
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {!imagePreviewing && !imageEditing && (
            <>
              <div className="overflow-auto">
                <div className="space-y-4">
                  {items.map((it, idx) => (
                    <div
                      key={it.id}
                      className="rounded-lg bg-[#0f1724] overflow-hidden"
                    >
                      <div className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex gap-2">
                              <CustomAvatar
                                src={user?.profile_picture}
                                name={user?.name}
                                className="size-10 border"
                              />
                              <div>
                                <p className="text-sm text-white font-semibold">
                                  {user?.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  @{user?.username}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div></div>
                              {items.length > 1 && (
                                <button
                                  onClick={() => removeThreadItem(idx)}
                                  className="text-gray-400 hover:text-red-400"
                                >
                                  <IoClose />
                                </button>
                              )}
                            </div>

                            <textarea
                              value={it.caption}
                              onChange={(e) =>
                                updateItem(idx, { caption: e.target.value })
                              }
                              placeholder="What's on your mind?"
                              className="w-full resize-none bg-transparent mt-3 text-white placeholder:text-gray-500 min-h-[80px] max-h-[180px] outline-none"
                              maxLength={500}
                            />
                            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white">
                                  <input
                                    type="file"
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleChangePostImage(e, idx)
                                    }
                                  />
                                  <BookImage className="w-4 h-4" />
                                </label>

                                <button
                                  className="flex items-center gap-2 text-gray-400 hover:text-white"
                                  onClick={() => {}}
                                >
                                  <HiLocationMarker className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="text-xs text-gray-400">
                                {it.caption.length}/500
                              </div>
                            </div>

                            <div className="border-t border-white/5 mt-3 pt-3" />

                            <div className="mt-3 flex flex-wrap gap-3">
                              {it.media.map((file, fIdx) => {
                                const fileId = `${idx}-${file.name}-${fIdx}`;
                                const progress =
                                  uploadProgress[fileId]?.progress || 0;
                                return (
                                  <div
                                    key={fIdx}
                                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/10 cursor-pointer"
                                    onClick={() =>
                                      handleExistingImageClick(file, idx, fIdx)
                                    }
                                  >
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemovePostImage(idx, fIdx);
                                      }}
                                      className="absolute top-1 right-1 bg-white/6 rounded p-1 z-10"
                                    >
                                      <IoClose className="w-3 h-3 text-white" />
                                    </button>

                                    {file.type.includes("video") ? (
                                      <div className="w-full h-full relative">
                                        <video
                                          src={URL.createObjectURL(file)}
                                          muted
                                          className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                          <IoVideocamOutline className="w-6 h-6 text-white" />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="w-full h-full relative">
                                        <Image
                                          src={URL.createObjectURL(file)}
                                          alt={`media-${fIdx}`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {canAddMorePost && (
                    <button
                      onClick={addThreadItem}
                      className="flex items-center px-4 gap-2 text-sm text-gray-400 hover:text-white"
                    >
                      <TbPlus /> Add more to post
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-background border-b border-white/6 px-4 py-8">
                <div className="bg-background border-b border-white/6 py-4">
                  <div className="gap-y-1 flex flex-col">
                    <div
                      onClick={() =>
                        setIsAudienceDialogOpen(!isAudienceDialogOpen)
                      }
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
                <div>
                  <Button
                    onClick={localCreatePostFunc}
                    disabled={canAddMorePost && isPostInitiated && isPosting}
                    className={`w-full mt-6 h-[52px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl ${
                      isPosting
                        ? "bg-background cursor-not-allowed opacity-50"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {isPosting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddPost;
