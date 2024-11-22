"use client";

import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Label } from "components/ui/label";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import Image from "next/image";
import { useState, useRef } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { LiaGlobeAmericasSolid } from "react-icons/lia";
import { TbPlus } from "react-icons/tb";
import Map from "../Reusable/Map";
import dynamic from "next/dynamic";
import "react-image-crop/dist/ReactCrop.css";
import { Crop } from "react-image-crop";

const ReactCrop = dynamic(() => import("react-image-crop"), { ssr: false });

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SocialPostFilterDialog = () => {
  const [postImage, setPostImage] = useState<File | null>(null);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(true);
  const [isAudienceDialogOpen, setIsAudienceDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>("");
  const [audience, setAudience] = useState<string>("Friends / Followers");
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

  const handleChangePostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setPostImage(e.target?.files?.[0] || null);
    handlePreviewImage();
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  const handleAudienceChange = (value: string) => {
    setAudience(value === "default" ? "Everyone" : "Friends / Followers");
    setIsAudienceDialogOpen(false);
  };

  const handlePreviewImage = () => {
    setImageProgress({ previewing: true, editing: false });
  };

  const handleEditImage = () => {
    setImageProgress({ previewing: false, editing: true });
  };

  const handleRemovePostImage = () => {
    setPostImage(null);
    setCroppedImage(null);
    setImageProgress({ previewing: false, editing: false });
  };

  const getCroppedImg = async (imageSrc: string, pixelCrop: CropArea): Promise<string> => {
    if (!completedCrop || !imgRef.current) {
      return Promise.reject("No crop area or image reference");
    }

    const image = imgRef.current;
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

    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };

  const handleDoneEditing = async () => {
    if (postImage && completedCrop) {
      try {
        const croppedImageUrl = await getCroppedImg(
          URL.createObjectURL(postImage),
          completedCrop
        );
        console.log(croppedImageUrl);
        if (croppedImageUrl) {
          setCroppedImage(croppedImageUrl);
          setImageProgress({ previewing: true, editing: false });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleNext = () => {
    setImageProgress({ previewing: false, editing: false });
  };

  return (
    <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
      <DialogTrigger>
        {/* <HiOutlineAdjustmentsHorizontal className="size-6" /> */}
      </DialogTrigger>
      <DialogContent className="flex flex-col overflow-hidden max-w-[650px] !h-[90dvh] p-0">
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

        {imageProgress.editing && postImage && (
          <>
            <div className="flex-1 overflow-hidden relative bg-black pb-16">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="h-full flex items-center justify-center"
                style={
                  {
                    "--ReactCrop__crop-border": "2px solid white",
                  } as React.CSSProperties
                }
              >
                <img
                  ref={imgRef}
                  src={URL.createObjectURL(postImage)}
                  alt="Crop me"
                  className="max-h-full max-w-full object-contain"
                />
              </ReactCrop>
            </div>
            <div className="sticky bottom-0 bg-background pt-2 p-4 mt-auto">
              <Button
                onClick={handleDoneEditing}
                className="w-full text-foreground"
                disabled={!completedCrop?.width || !completedCrop?.height}
              >
                Done
              </Button>
            </div>
          </>
        )}

        {imageProgress.previewing && postImage && (
          <>
            <div className="flex-1 overflow-hidden p-4 px-6">
              <div className="h-full w-full bg-accent relative rounded-lg ">
                <span
                  onClick={handleRemovePostImage}
                  className="absolute bg-white z-20 rounded-sm top-4 right-4 p-1"
                >
                  <IoClose className="size-6 text-background" />
                </span>
                <Image
                  src={croppedImage || URL.createObjectURL(postImage)}
                  alt="post-image"
                  objectFit="cover"
                  className="rounded-lg object-contain"
                  fill
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-background justify-between gap-x-4 flex flex-row pt-2 pb-4 px-6 mt-auto">
              <Button
                onClick={handleEditImage}
                variant={"outline"}
                className="border-primary bg-primary/20 w-full text-foreground"
              >
                Edit
              </Button>
              <Button onClick={handleNext} className="w-full text-foreground">
                Next
              </Button>
            </div>
          </>
        )}

        {!imageProgress.editing && !imageProgress.previewing && (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-y-4 p-4">
                <div className=" p-3 pb-6 flex gap-x-3 items-start h-32 bg-accent rounded-lg">
                  <Avatar className="size-10 border border-foreground">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="mt-2.5 w-full h-full">
                    <textarea
                      className="!border-none bg-accent !outline-none text-foreground h-full !ring-0 text-sm w-full resize-none"
                      placeholder="What's on your mind?"
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-4">
                  <div className="relative size-32 bg-accent flex rounded-lg">
                    <div className="absolute w-fit gap-y-2 place-items-center inset-0 m-auto flex flex-col justify-center  ">
                      <TbPlus className="size-8" />
                      <span className="text-xs font-medium">Add Media</span>
                    </div>
                    <div className="h-full absolute flex">
                      <input
                        onChange={handleChangePostImage}
                        type="file"
                        className="h-full w-full rounded-lg opacity-0"
                      />
                    </div>
                  </div>

                  {postImage && !imageProgress.editing && !imageProgress.previewing && (
                    <div className="size-32 bg-accent relative rounded-lg ">
                      <span
                        onClick={handleRemovePostImage}
                        className="absolute bg-white z-20 rounded-sm top-2 right-2 p-1"
                      >
                        <IoClose className="size-4.5 text-background" />
                      </span>
                      <Image
                        onClick={handlePreviewImage}
                        src={croppedImage || URL.createObjectURL(postImage)}
                        alt="post-image"
                        objectFit="cover"
                        className="rounded-lg"
                        fill
                      />
                    </div>
                  )}
                </div>

                <div className="gap-y-1 flex flex-col">
                  <div className="flex flex-row gap-x-2 items-center">
                    <div className="bg-accent p-1.5 text-sm rounded-sm w-fit h-fit">
                      <HiLocationMarker className="size-5" />
                    </div>
                    <p className="text-sm">{selectedLocation}</p>
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
                      <p className="text-sm">Audience</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <span className="text-sm text-muted-foreground">{audience}</span>
                      <IoIosArrowDown
                        className={`size-5 duration-500 transition-transform ${
                          isAudienceDialogOpen ? "-rotate-180 " : ""
                        }`}
                      />
                    </div>
                  </div>

                  {isAudienceDialogOpen && (
                    <RadioGroup
                      value={audience === "Everyone" ? "default" : "comfortable"}
                      onValueChange={handleAudienceChange}
                      className="flex flex-col gap-y-3 mt-2"
                    >
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col gap-y-1 w-full">
                          <div className="flex flex-row gap-x-2 items-center justify-between">
                            <p className="text-sm font-semibold">Everyone</p>
                            <div>
                              <RadioGroupItem value="default" id="r1" />
                              <Label htmlFor="r1" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Choosing 'Everyone' makes your posts visible to all.
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col gap-y-1 w-full">
                          <div className="flex flex-row gap-x-2 items-center justify-between">
                            <p className="text-sm font-semibold">Friends / Followers</p>
                            <div>
                              <RadioGroupItem value="comfortable" id="r2" />
                              <Label htmlFor="r2" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Choosing 'Friends/Followers' limits your posts to your friends or
                            followers.{" "}
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-background pt-2 p-4 mt-auto">
              <Button className="w-full text-foreground">Upload Post</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SocialPostFilterDialog;
