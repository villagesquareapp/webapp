"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Switch } from "components/ui/switch";
import { FaArrowLeft, FaVideo } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import LiveStreamDialog from "./LiveStreamDialog";


interface StreamInfoStepProps {
  category: string | null;
  setCategory: (value: string) => void;
  privacy: string | null;
  setPrivacy: (value: string) => void;
  showAdditionalSettings: boolean;
  setShowAdditionalSettings: (value: boolean) => void;
  setTitleInput: (value: string) => void;
  commentsEnabled: boolean;
  setCommentsEnabled: (value: boolean) => void;
  questionsEnabled: boolean;
  setQuestionsEnabled: (value: boolean) => void;
  giftingEnabled: boolean;
  setGiftingEnabled: (value: boolean) => void;
}

const StreamInfoStep = ({
  category,
  setCategory,
  privacy,
  setPrivacy,
  showAdditionalSettings,
  setShowAdditionalSettings,
  setTitleInput,
  commentsEnabled,
  setCommentsEnabled,
  questionsEnabled,
  setQuestionsEnabled,
  giftingEnabled,
  setGiftingEnabled,
}: StreamInfoStepProps) => (
  <div className="h-full overflow-y-auto">
    <form className="h-full w-full flex flex-col gap-y-4">
      {/* Title Input */}
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="title" className="font-semibold">
          Title <span className="text-muted-foreground">{"(Optional)"}</span>
        </Label>
        <Input
          id="title"
          className="bg-accent no_input_border"
          placeholder="Title"
          onChange={(e) => setTitleInput(e.target.value)}
        />
      </div>

      {/* Category Select */}
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="category" className="font-semibold">
          Category
        </Label>
        <Select value={category || ""} onValueChange={setCategory}>
          <SelectTrigger className="w-full !border-none !outline-none bg-accent !ring-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="1">General</SelectItem>
              {/* <SelectItem value="2">Category two</SelectItem>
              <SelectItem value="3">Category three</SelectItem> */}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-y-2">
        <Label htmlFor="privacy" className="font-semibold">
          Privacy Settings
        </Label>
        <Select value={privacy || ""} onValueChange={setPrivacy}>
          <SelectTrigger className="w-full !border-none !outline-none bg-accent !ring-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Visibility</SelectLabel>
              <SelectItem value="everyone">Everyone</SelectItem>
              <SelectItem value="friends">Friends</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Settings (Toggable) */}
      <div className="flex flex-col gap-y-3 pb-4">
        <div
          onClick={() => setShowAdditionalSettings(!showAdditionalSettings)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="font-semibold flex">
            Additional Settings{" "}
            <span className="text-muted-foreground">{"(Optional)"}</span>
          </div>
          <IoIosArrowDown
            className={`size-5 cursor-pointer transition-transform duration-500 ${
              showAdditionalSettings ? "rotate-180" : ""
            }`}
          />
        </div>
        {showAdditionalSettings && (
          <>
            <div className="flex flex-row justify-between">
              <Label htmlFor="comments-switch">Turn Off Comments</Label>
              <Switch
                id="comments-switch"
                checked={commentsEnabled}
                onCheckedChange={(checked) => setCommentsEnabled(checked)}
              />
            </div>
            <div className="flex flex-row justify-between">
              <Label htmlFor="questions-switch">Turn Off Questions</Label>
              <Switch
                id="questions-switch"
                checked={questionsEnabled}
                onCheckedChange={(checked) => setQuestionsEnabled(checked)}
              />
            </div>
            <div className="flex flex-row justify-between">
              <Label htmlFor="gifting-switch">Disable Gifting</Label>
              <Switch
                id="gifting-switch"
                checked={giftingEnabled}
                onCheckedChange={(checked) => setGiftingEnabled(checked)}
              />
            </div>
          </>
        )}
      </div>
    </form>
  </div>
);

export default StreamInfoStep;
