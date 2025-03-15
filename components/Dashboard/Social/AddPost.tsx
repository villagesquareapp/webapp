"use client";

import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Label } from "components/ui/label";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { LiaGlobeAmericasSolid } from "react-icons/lia";
import { TbPlus } from "react-icons/tb";
import { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Map from "../Reusable/Map";
import NewSocialField from "./NewSocialField";
import { IoVideocamOutline } from "react-icons/io5";
import { createPost } from "api/post";
import { toast } from "sonner";

const ReactCrop = dynamic(() => import("react-image-crop"), { ssr: false });

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PreviewImage {
  type: "new" | "edit";
  position: string;
  file: File | null;
}

const SocialPostFilterDialog = ({
  user,
  addPost,
}: {
  user: IUser;
  addPost: (newPost: IPost) => void;
}) => {
  const [imageProgress, setImageProgress] = useState({
    editing: false,
    previewing: false,
  });
  const [crop, setCrop] = useState<Crop>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    unit: "%",
  });
  const [completedCrop, setCompletedCrop] = useState<CropArea>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [isAudienceDialogOpen, setIsAudienceDialogOpen] = useState(false);
  const [previewImageForPost, setPreviewImageForPost] = useState<PreviewImage>({
    type: "new",
    position: "",
    file: null,
  });
  const [newPost, setNewPost] = useState<INewPost>({
    caption: "",
    media_files: [],
    address: "",
    latitude: "",
    longitude: "",
    privacy: "everyone",
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to adjust textarea height
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 400)}px`;
  };

  // Initialize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    }
  }, []);

  console.log("NEW POST", newPost);
  console.log("PREVIEW IMAGE", previewImageForPost);

  const createPostFunc = async () => {
    console.log("CREATING POST...");
    const formData = new FormData();

    formData.append("caption", newPost.caption);
    formData.append("address", newPost.address);
    formData.append("latitude", newPost.latitude);
    formData.append("longitude", newPost.longitude);
    formData.append("privacy", newPost.privacy);
    newPost.media_files.forEach((file) => {
      formData.append("media_files", file);
    });

    const result = await createPost(formData);
    if (result?.status) {
      if (result?.data?.data) {
        addPost(result?.data?.data[0]);
        toast.success("Post created successfully");
      }
    } else {
      toast.error(result?.message);
    }
  };

  const handleChangePostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    // Check if we've already reached the maximum number of images
    if (newPost.media_files.length >= 4) {
      // Don't proceed if we already have 4 images
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImageForPost({
      type: "new",
      position: "",
      file: file,
    });
    handlePreviewImage();
  };

  const handleFileFromNewSocialField = (file: File) => {
    // Check if we've already reached the maximum number of images
    if (newPost.media_files.length >= 4) {
      return;
    }

    setPreviewImageForPost({
      type: "new",
      position: "",
      file: file,
    });
    handlePreviewImage();
  };

  const handleLocationSelect = (location: string) => {
    setNewPost({ ...newPost, address: location });
  };

  const handleAudienceChange = (value: string) => {
    setNewPost({ ...newPost, privacy: value as PrivacyType });
    setIsAudienceDialogOpen(false);
  };

  const handlePreviewImage = () => {
    setImageProgress({ previewing: true, editing: false });
  };

  const handleEditImage = () => {
    setImageProgress({ previewing: false, editing: true });
  };

  const handleRemovePostImage = (indexToRemove?: number) => {
    if (typeof indexToRemove === "number") {
      // Remove specific image by index
      setNewPost({
        ...newPost,
        media_files: newPost.media_files.filter((_, index) => index !== indexToRemove),
      });
    } else {
      // Reset preview state when no specific index
      setPreviewImageForPost({
        type: "new",
        position: "",
        file: null,
      });
    }
    setCroppedImage(null);
    setImageProgress({ previewing: false, editing: false });
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    pixelCrop: CropArea
  ): Promise<File | null> => {
    if (!completedCrop) {
      return null;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x,
      completedCrop.y,
      completedCrop.width,
      completedCrop.height,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        // Create a new File from the blob
        const currentFile = previewImageForPost.file;
        if (!currentFile) {
          resolve(null);
          return;
        }

        const croppedFile = new File([blob], currentFile.name, {
          type: "image/jpeg",
          lastModified: new Date().getTime(),
        });

        // Also set the cropped image URL for preview
        setCroppedImage(URL.createObjectURL(blob));
        resolve(croppedFile);
      }, "image/jpeg");
    });
  };

  const handleDoneEditing = async () => {
    if (imgRef.current && completedCrop && previewImageForPost.file) {
      try {
        const croppedFile = await getCroppedImg(imgRef.current, completedCrop);

        if (croppedFile) {
          // Update the preview image with the cropped file
          setPreviewImageForPost({
            ...previewImageForPost,
            file: croppedFile,
          });
          setImageProgress({ previewing: true, editing: false });
        }
      } catch (e) {
        console.error("Error cropping image:", e);
      }
    }
  };

  const handleNext = () => {
    if (previewImageForPost.file) {
      if (previewImageForPost.type === "new") {
        // Check if adding a new image would exceed the limit
        if (newPost.media_files.length >= 4) {
          // Don't add more images if we already have 4
          setPreviewImageForPost({
            type: "new",
            position: "",
            file: null,
          });
          setCroppedImage(null);
          setImageProgress({ previewing: false, editing: false });
          return;
        }

        // Add new image to media_files
        setNewPost({
          ...newPost,
          media_files: [...newPost.media_files, previewImageForPost.file],
        });
      } else if (previewImageForPost.type === "edit" && previewImageForPost.position) {
        // Replace existing image at the specified position
        const position = parseInt(previewImageForPost.position);
        const updatedFiles = [...newPost.media_files];
        updatedFiles[position] = previewImageForPost.file;

        setNewPost({
          ...newPost,
          media_files: updatedFiles,
        });
      }
    }

    // Reset states
    setPreviewImageForPost({
      type: "new",
      position: "",
      file: null,
    });
    setCroppedImage(null);
    setImageProgress({ previewing: false, editing: false });
  };

  const handleExistingImageClick = (file: File, index: number) => {
    setPreviewImageForPost({
      type: "edit",
      position: index.toString(),
      file: file,
    });
    handlePreviewImage();
  };

  return (
    <>
      <NewSocialField
        user={user}
        openNewPostDialog={() => setIsNewPostDialogOpen(true)}
        addImage={handleFileFromNewSocialField}
      />
      <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
        <DialogContent className="flex flex-col overflowhidden max-w-[800px] h-[90dvh] !max-h-[900px] p-0">
          <DialogHeader className="sticky top-0 bg-background border-b z-50">
            <div className="flex items-center justify-between px-6 py-3">
              <DialogTitle className="text-center flex-1">Add Post</DialogTitle>
              <Button
                variant="ghost"
                className="p-1 px-2.5 rounded-full transition-colors"
                onClick={() => setIsNewPostDialogOpen(false)}
              >
                <IoClose className="size-6" />
              </Button>
            </div>
          </DialogHeader>

          {imageProgress.editing && previewImageForPost.file && (
            <>
              <div className="flex-1 overflow-hidden relative bg-black flex flex-col">
                <span
                  onClick={() => {
                    // If editing an existing image (has position)
                    if (previewImageForPost.type === "edit" && previewImageForPost.position) {
                      const position = parseInt(previewImageForPost.position);
                      // Remove the image at this position
                      handleRemovePostImage(position);
                    } else {
                      // Just cancel the current editing session
                      handleRemovePostImage();
                    }
                  }}
                  className="absolute bg-white border border-black/10 z-20 rounded-sm top-2 right-2 p-1 cursor-pointer"
                >
                  <IoClose className="size-4.5 text-background" />
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    className="flex items-center justify-center"
                    style={
                      {
                        "--ReactCrop__crop-border": "2px solid white",
                      } as React.CSSProperties
                    }
                  >
                    <img
                      ref={imgRef}
                      src={URL.createObjectURL(previewImageForPost.file)}
                      alt="Crop me"
                      className="max-h-[calc(90vh-150px)] max-w-full object-contain"
                    />
                  </ReactCrop>
                </div>
              </div>
              <div className="bg-background pt-2 p-4 mt-auto">
                <Button
                  onClick={handleDoneEditing}
                  className="w-full text-foreground h-[51px]"
                  disabled={!completedCrop?.width || !completedCrop?.height}
                >
                  Done
                </Button>
              </div>
            </>
          )}

          {imageProgress.previewing && previewImageForPost?.file && (
            <>
              <div className="flex-1 overflow-hidden p-4 px-6">
                <div className="h-full w-full bg-accent relative rounded-lg ">
                  <span
                    onClick={() => handleRemovePostImage()}
                    className="absolute bg-white border border-black/10 z-20 rounded-sm top-4 right-4 p-1"
                  >
                    <IoClose className="size-6 text-background" />
                  </span>

                  {previewImageForPost.file?.type.includes("video") ? (
                    <video
                      src={URL.createObjectURL(previewImageForPost.file)}
                      className="rounded-lg w-full h-full object-contain"
                      controls
                      autoPlay
                      muted
                    />
                  ) : (
                    <Image
                      src={croppedImage || URL.createObjectURL(previewImageForPost.file)}
                      alt="post-image"
                      className="rounded-lg object-contain"
                      fill
                    />
                  )}
                </div>
              </div>
              <div className="bg-background justify-between gap-x-4 flex flex-row pt-2 pb-4 px-6 mt-auto">
                {!previewImageForPost.file?.type.includes("video") && (
                  <Button
                    onClick={handleEditImage}
                    variant={"outline"}
                    className="border-primary bg-primary/20 w-full text-foreground h-[51px]"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className={`w-full text-foreground h-[51px] ${
                    !previewImageForPost.file?.type.includes("video") ? "" : "w-full"
                  }`}
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {!imageProgress.editing && !imageProgress.previewing && (
            <>
              <div className="flex-1 overflow-y-auto relative">
                <div className="flex flex-col gap-y-4 p-4">
                  <div className=" p-3 pb-6 flex gap-x-3 items-start h-fit bg-accent rounded-lg">
                    {user?.profile_picture && (
                      <CustomAvatar
                        src={user?.profile_picture}
                        name={user?.name}
                        className="size-10 border border-foreground"
                      />
                    )}

                    <div className="mt-2.5 w-full h-full">
                      <textarea
                        value={newPost.caption}
                        ref={textareaRef}
                        rows={5}
                        className="!border-none bg-accent !outline-none text-foreground min-h-[36px] max-h-[400px] !ring-0 text-sm w-full resize-none overflow-hidden"
                        placeholder="What's on your mind?"
                        onChange={(e) => {
                          adjustHeight(e.target as HTMLTextAreaElement);
                          setNewPost({ ...newPost, caption: e.target.value });
                        }}
                        onInput={(e) => adjustHeight(e.target as HTMLTextAreaElement)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row gap-4 flex-wrap">
                    {newPost.media_files.length < 4 && (
                      <div className="relative size-32 bg-accent flex rounded-lg">
                        <div className="absolute w-fit gap-y-2 place-items-center inset-0 m-auto flex flex-col justify-center">
                          <TbPlus className="size-8" />
                          <span className="text-xs font-medium">Add Media</span>
                        </div>
                        <div className="h-full absolute flex">
                          <input
                            onChange={handleChangePostImage}
                            type="file"
                            accept="image/*, video/*"
                            className="h-full w-full rounded-lg opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {newPost.media_files.length >= 4 && (
                      <div className="relative size-32 bg-accent/50 flex rounded-lg border border-primary/30">
                        <div className="absolute w-fit gap-y-2 place-items-center inset-0 m-auto flex flex-col justify-center text-center px-2">
                          <span className="text-xs font-medium">Maximum 4 images reached</span>
                        </div>
                      </div>
                    )}

                    {newPost?.media_files?.map((file, index) => (
                      <div
                        key={index}
                        className="size-32 bg-accent relative rounded-lg cursor-pointer"
                        onClick={() => handleExistingImageClick(file, index)}
                      >
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePostImage(index);
                          }}
                          className="absolute bg-white border border-black/10 z-20 rounded-sm top-2 right-2 p-1"
                        >
                          <IoClose className="size-4.5 text-background" />
                        </span>

                        {file.type.includes("video") ? (
                          <>
                            <div className="relative w-full h-full">
                              <video
                                src={URL.createObjectURL(file)}
                                className="rounded-lg object-cover w-full h-full"
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                                <IoVideocamOutline className="size-8 text-white" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`post-media-${index}`}
                            className="rounded-lg object-cover"
                            fill
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="gap-y-1 flex flex-col">
                    <div className="flex flex-row gap-x-2 items-center">
                      <div className="bg-accent p-1.5 text-sm rounded-sm w-fit h-fit">
                        <HiLocationMarker className="size-5" />
                      </div>
                      <p className="text-sm">{newPost.address}</p>
                    </div>
                    <Map onLocationSelect={handleLocationSelect} />
                  </div>

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
                          {newPost.privacy}
                        </span>
                        <IoIosArrowDown
                          className={`size-5 duration-500 transition-transform ${
                            isAudienceDialogOpen ? "-rotate-180 " : ""
                          }`}
                        />
                      </div>
                    </div>

                    {isAudienceDialogOpen && (
                      <RadioGroup
                        value={
                          newPost.privacy === "everyone"
                            ? "default"
                            : newPost.privacy === "followers"
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
                                <RadioGroupItem className="size-5" value="default" id="r1" />
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
                              Choosing 'Friends/Followers' limits your posts to your friends or
                              followers.{" "}
                            </p>
                          </div>
                        </div>
                        <div
                          className="flex justify-between w-full cursor-pointer"
                          onClick={() => handleAudienceChange("private")}
                        >
                          <div className="flex flex-col gap-y-1 w-full">
                            <div className="flex flex-row gap-x-2 items-end justify-between">
                              <p className="font-semibold">Private</p>
                              <div>
                                <RadioGroupItem className="size-5" value="private" id="r3" />
                                <Label htmlFor="r3" />
                              </div>
                            </div>
                            <p className="text-sm font-light">
                              Choosing 'Private' limits your posts to only you.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                </div>
              </div>
              <div className=" bg-background pt-2 p-4 mt-auto">
                <Button
                  onClick={() => createPostFunc()}
                  type="submit"
                  className="flex text-foreground h-[52px] w-[95%] mx-auto mt-auto mb-4"
                >
                  Upload Post
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SocialPostFilterDialog;
