"use client";

import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "components/ui/dialog";
import { Label } from "components/ui/label";
import { useState } from "react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import dynamic from "next/dynamic";

const MapWrapper = dynamic(() => import("../Reusable/Map"), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-accent/20 rounded-lg animate-pulse" />,
});

const SocialPostFilterDialog = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>();

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <HiOutlineAdjustmentsHorizontal className="size-6" />
      </DialogTrigger>
      <DialogTitle className="sr-only">Filter</DialogTitle>
      <DialogContent className="flex flex-col gap-y-4">
        <div className="gap-y-1 flex flex-col">
          <p className="font-semibold">Location</p>
          <div className="bg-accent py-3 px-4 text-sm rounded-lg">
            {selectedLocation ? selectedLocation : "Select Location"}
          </div>
          <MapWrapper onLocationSelect={handleLocationSelect} />
        </div>
        <div className="flex flex-col gap-y-1">
          <p className="font-semibold">Sort By</p>
          <div className="flex flex-wrap gap-3">
            <span className="border py-1.5 text-sm px-4 rounded-lg text-muted-foreground">
              Popularity
            </span>
            <span className="border py-1.5 text-sm px-4 rounded-lg text-muted-foreground">
              Latest{" "}
            </span>
            <span className="border border-primary bg-black py-1.5 text-sm px-4 rounded-lg text-muted-foreground">
              New to Old
            </span>
            <span className="border py-1.5 text-sm px-4 rounded-lg text-muted-foreground">
              Old to New
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <p className="font-semibold">Sort By</p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">Live</p>
              <div className="flex items-center">
                <Checkbox
                  id="live"
                  className="h-6 w-6 !rounded-sm border-2 border-primary data-[state=checked]:bg-white data-[state=checked]:text-primary"
                />
                <Label
                  htmlFor="live"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">Echoes</p>
              <div className="flex items-center">
                <Checkbox
                  id="echoes"
                  className="h-6 w-6 !rounded-sm border-2 border-primary data-[state=checked]:bg-white data-[state=checked]:text-primary"
                />
                <Label
                  htmlFor="echoes"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">Post</p>
              <div className="flex items-center">
                <Checkbox
                  id="post"
                  className="h-6 w-6 !rounded-sm border-2 border-primary data-[state=checked]:bg-white data-[state=checked]:text-primary"
                />
                <Label
                  htmlFor="post"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-4 w-full">
          <Button className="w-full bg-primary/25" variant={"outline"}>
            Reset
          </Button>
          <Button className="w-full text-foreground">Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialPostFilterDialog;
