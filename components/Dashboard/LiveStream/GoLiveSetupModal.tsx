"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "components/ui/dialog";
import { Button } from "components/ui/button";
import { Switch } from "components/ui/switch";
import { IoClose } from "react-icons/io5";
import { FaVideo, FaChevronDown, FaEye } from "react-icons/fa";
import { BiMessageRounded, BiGift } from "react-icons/bi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { getFormattedDateTime } from "lib/getFormattedDateTime";
import { toast } from "sonner";

interface GoLiveSetupModalProps {
  open: boolean;
  onClose: () => void;
}

interface CategoryItem {
  id: string;
  icon: string;
  label: string;
  description: string;
  color: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: "1", icon: "👥", label: "Social", description: "Chatting, Q&A, updates", color: "bg-blue-500/20" },
  { id: "2", icon: "💻", label: "Tech", description: "Invite others to join your live", color: "bg-purple-500/20" },
  { id: "3", icon: "💄", label: "Beauty", description: "Talking, podcasts, discussions", color: "bg-pink-500/20" },
  { id: "4", icon: "🎮", label: "Gaming", description: "Play and interact with viewers", color: "bg-green-500/20" },
];

const GoLiveSetupModal = ({ open, onClose }: GoLiveSetupModalProps) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [privacy, setPrivacy] = useState("everyone");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allowComments, setAllowComments] = useState(true);
  const [allowGuestRequests, setAllowGuestRequests] = useState(false);
  const [allowGifts, setAllowGifts] = useState(true);
  const [recordLivestream, setRecordLivestream] = useState(false);

  const handlePreviewLive = useCallback(() => {
    if (!title.trim()) {
      toast.error("Please enter a stream title.");
      return;
    }

    const { startDate, startTime } = getFormattedDateTime();

    const livestreamData = {
      title: title.trim(),
      category_id: selectedCategory || "1",
      start_date: startDate,
      start_time: startTime,
      privacy,
      comments_enabled: allowComments,
      questions_enabled: allowGuestRequests,
      gifting_enabled: allowGifts,
      record_livestream: recordLivestream,
    };

    localStorage.setItem("pending_livestream", JSON.stringify(livestreamData));
    onClose();
    router.push("/livestream/setup");
  }, [title, selectedCategory, privacy, allowComments, allowGuestRequests, allowGifts, recordLivestream, router, onClose]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="!max-w-[680px] w-full p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#1C1C1E] shadow-2xl [&>button:last-child]:hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Go Live</h2>
            <p className="text-sm text-[#8E8E93] mt-0.5">Set up your livestream before going live.</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
            <IoClose className="text-white/70 size-5" />
          </button>
        </div>

        {/* Body - Two columns */}
        <div className="flex px-6 pb-4 gap-8">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Stream Title */}
            <div>
              <label className="text-sm font-semibold text-white mb-2 block">Stream Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your live about"
                className="w-full bg-transparent border border-white/10 py-2 px-4 rounded-lg outline-none text-white text-sm placeholder:text-[#48484A] focus:border-white/30 transition-colors"
              />
              <p className="text-[11px] text-[#8E8E93] mt-1.5">Choose a clear and engaging title.</p>
            </div>

            {/* Privacy */}
            <div>
              <label className="text-sm font-semibold text-white mb-2 block">Privacy</label>
              <div className="relative">
                <div className="flex items-center gap-2 w-full border border-white/10 rounded-lg px-3 py-2.5">
                  {privacy === "everyone" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70 shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70 shrink-0">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  )}
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="flex-1 appearance-none bg-transparent text-sm text-white outline-none cursor-pointer"
                  >
                    <option value="everyone" className="bg-[#1C1C1E]">Public</option>
                    <option value="friends" className="bg-[#1C1C1E]">Followers</option>
                  </select>
                  <FaChevronDown className="text-white/40 size-3 shrink-0 pointer-events-none" />
                </div>
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-1.5">
                {privacy === "everyone" ? "Anyone can discover and watch your live." : "Only your followers can watch your live."}
              </p>
            </div>

            {/* Live Category */}
            <div>
              <label className="text-sm font-semibold text-white mb-3 block">Live Category</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                      selectedCategory === cat.id
                        ? "border-white/40 bg-white/5"
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-semibold text-white">{cat.label}</span>
                    <span className="text-[10px] text-[#8E8E93] leading-tight">{cat.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Interaction Controls */}
          <div className="w-[250px] shrink-0">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Interaction Controls</h3>
              <p className="text-[11px] text-[#8E8E93] mb-4">Manage how viewers can interact with you.</p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Allow comments */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BiMessageRounded className="text-white/60 size-5" />
                  <div>
                    <p className="text-[13px] font-medium text-white">Allow comments</p>
                    <p className="text-[11px] text-[#8E8E93]">Viewers can comment in real time</p>
                  </div>
                </div>
                <Switch checked={allowComments} onCheckedChange={setAllowComments} />
              </div>

              {/* Allow guest requests */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HiOutlineUserGroup className="text-white/60 size-5" />
                  <div>
                    <p className="text-[13px] font-medium text-white">Allow guest requests</p>
                    <p className="text-[11px] text-[#8E8E93]">Viewers can request to join</p>
                  </div>
                </div>
                <Switch checked={allowGuestRequests} onCheckedChange={setAllowGuestRequests} />
              </div>

              {/* Allow gifts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BiGift className="text-white/60 size-5" />
                  <div>
                    <p className="text-[13px] font-medium text-white">Allow gifts</p>
                    <p className="text-[11px] text-[#8E8E93]">Viewers can send virtual gifts</p>
                  </div>
                </div>
                <Switch checked={allowGifts} onCheckedChange={setAllowGifts} />
              </div>

              {/* Record livestream */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MdOutlineVideoLibrary className="text-white/60 size-5" />
                  <div>
                    <p className="text-[13px] font-medium text-white">Record livestream</p>
                    <p className="text-[11px] text-[#8E8E93]">Record and save your live video</p>
                  </div>
                </div>
                <Switch checked={recordLivestream} onCheckedChange={setRecordLivestream} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-[12px] text-[#8E8E93]">Your live will be visible to selected audience</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose} className="text-white/70 hover:text-white px-4">
              Cancel
            </Button>
            <Button
              onClick={handlePreviewLive}
              className="bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white rounded-full px-6 h-9 font-medium flex items-center gap-2"
            >
              <FaEye className="size-3" />
              Preview Live
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoLiveSetupModal;
