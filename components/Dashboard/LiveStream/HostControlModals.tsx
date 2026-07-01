"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "components/ui/dialog";
import { Switch } from "components/ui/switch";
import { Button } from "components/ui/button";
import { IoClose, IoSearch, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { FaArrowLeft, FaChevronRight } from "react-icons/fa";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { endLivestream } from "api/livestreams";
import { toast } from "sonner";

type ModalView = "management" | "add-cohost" | "invite-users" | "requests" | null;

interface HostControlModalsProps {
  open: boolean;
  onClose: () => void;
  initialView: ModalView;
  showBack?: boolean;
  streamUuid?: string;
}

// Dummy data
const SUGGESTED_USERS = [
  { uuid: "1", name: "Khoko_Lagos", avatar: "", followers: "8.7k" },
  { uuid: "2", name: "Idowu Adedamola", avatar: "", followers: "5.4k" },
  { uuid: "3", name: "LakeBradson", avatar: "", followers: "500" },
  { uuid: "4", name: "Ohhyinn", avatar: "", followers: "1.1k" },
  { uuid: "5", name: "VEGAS", avatar: "", followers: "12.3k" },
  { uuid: "6", name: "Karire Josiah", avatar: "", followers: "70k" },
];

const REQUEST_USERS = [
  { uuid: "1", name: "Khoko_Lagos", avatar: "", followers: "8.7k" },
  { uuid: "2", name: "Idowu Adedamola", avatar: "", followers: "5.4k" },
  { uuid: "3", name: "LakeBradson", avatar: "", followers: "500" },
  { uuid: "4", name: "Ohhyinn", avatar: "", followers: "1.1k" },
  { uuid: "5", name: "VEGAS", avatar: "", followers: "12.3k" },
];

const HostControlModals = ({ open, onClose, initialView, showBack = false, streamUuid }: HostControlModalsProps) => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ModalView>(initialView);
  const [hasBackHistory, setHasBackHistory] = useState(showBack);
  const [allowComments, setAllowComments] = useState(true);
  const [allowGuestRequests, setAllowGuestRequests] = useState(false);
  const [allowGifts, setAllowGifts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedUsers, setAddedUsers] = useState<Set<string>>(new Set());
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set());
  const [isEndingSession, setIsEndingSession] = useState(false);

  // Sync state when modal opens with new view
  useEffect(() => {
    if (open) {
      setCurrentView(initialView);
      setHasBackHistory(showBack);
    }
  }, [open, initialView, showBack]);

  const handleClose = () => {
    setCurrentView(null);
    setSearchQuery("");
    onClose();
  };

  const handleEndSession = async () => {
    if (!streamUuid) {
      toast.error("Stream information not available");
      return;
    }
    setIsEndingSession(true);
    try {
      const response = await endLivestream(streamUuid);
      if (response.status) {
        toast.success("Livestream ended successfully");
        onClose();
        window.location.href = "/livestream";
      } else {
        toast.error(response.message || "Failed to end livestream");
      }
    } catch (error) {
      console.error("Error ending livestream:", error);
      toast.error("An error occurred while ending the livestream");
    } finally {
      setIsEndingSession(false);
    }
  };

  const navigateToSubView = (view: ModalView) => {
    setCurrentView(view);
    setHasBackHistory(true);
  };

  const handleBack = () => {
    setCurrentView("management");
    setHasBackHistory(false);
    setSearchQuery("");
  };

  const toggleAddUser = (uuid: string) => {
    setAddedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  };

  const toggleInviteUser = (uuid: string) => {
    setInvitedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid);
      else next.add(uuid);
      return next;
    });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="!max-w-[500px] w-full p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#1C1C1E] shadow-2xl [&>button:last-child]:hidden">
        
        {/* ===== MANAGEMENT VIEW ===== */}
        {currentView === "management" && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <h2 className="text-lg font-bold text-white">Livestream Management</h2>
              <button onClick={handleClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
                <IoClose className="text-white/70 size-5" />
              </button>
            </div>

            {/* Navigation items */}
            <div className="px-6 mb-4">
              <button
                onClick={() => navigateToSubView("add-cohost")}
                className="w-full flex items-center justify-between py-4 border-b border-white/5 hover:bg-white/5 transition-colors -mx-2 px-2 rounded-lg"
              >
                <div>
                  <p className="text-white font-semibold text-sm text-left">Add Cohost</p>
                  <p className="text-[#8E8E93] text-xs text-left">Invite others to co-host your live session.</p>
                </div>
                <FaChevronRight className="text-white/40 size-3.5" />
              </button>

              <button
                onClick={() => navigateToSubView("invite-users")}
                className="w-full flex items-center justify-between py-4 border-b border-white/5 hover:bg-white/5 transition-colors -mx-2 px-2 rounded-lg"
              >
                <div>
                  <p className="text-white font-semibold text-sm text-left">Invite Users</p>
                  <p className="text-[#8E8E93] text-xs text-left">Send an invite to join as a co-host</p>
                </div>
                <FaChevronRight className="text-white/40 size-3.5" />
              </button>
            </div>

            {/* Interaction Controls */}
            <div className="px-6 pb-4">
              <h3 className="text-white font-semibold text-sm mb-4">Interaction Controls</h3>
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Allow comments</p>
                    <p className="text-[#8E8E93] text-xs">Viewers can comment in real time during live sessions.</p>
                  </div>
                  <Switch checked={allowComments} onCheckedChange={setAllowComments} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Allow guest requests</p>
                    <p className="text-[#8E8E93] text-xs">Viewers can request to join the live session.</p>
                  </div>
                  <Switch checked={allowGuestRequests} onCheckedChange={setAllowGuestRequests} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Allow gifts</p>
                    <p className="text-[#8E8E93] text-xs">Viewers can send virtual gifts during the live session.</p>
                  </div>
                  <Switch checked={allowGifts} onCheckedChange={setAllowGifts} />
                </div>
              </div>
            </div>

            {/* End Session button */}
            <div className="px-6 pb-6">
              <Button
                onClick={handleEndSession}
                disabled={isEndingSession}
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
              >
                {isEndingSession ? "Ending..." : "End Session"}
              </Button>
            </div>
          </div>
        )}

        {/* ===== ADD CO-HOST VIEW ===== */}
        {currentView === "add-cohost" && (
          <div className="flex flex-col max-h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <div className="flex items-center gap-3">
                {hasBackHistory && (
                  <button onClick={handleBack} className="p-1 hover:bg-white/5 rounded-full transition-colors">
                    <FaArrowLeft className="text-white/70 size-4" />
                  </button>
                )}
                <h2 className="text-lg font-bold text-white">Add Co-host</h2>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
                <IoClose className="text-white/70 size-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 pb-4">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 h-10">
                <IoSearch className="text-white/40 size-4 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users"
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 outline-none"
                />
              </div>
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <p className="text-[#8E8E93] text-xs font-semibold mb-3">Suggested</p>
              <div className="flex flex-col gap-3">
                {SUGGESTED_USERS.slice(0, 3).map((u) => (
                  <div key={u.uuid} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CustomAvatar src={u.avatar} name={u.name} className="size-10" />
                      <div>
                        <p className="text-white text-sm font-medium">{u.name}</p>
                        <p className="text-[#8E8E93] text-xs">{u.followers} followers</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toggleAddUser(u.uuid)}
                      className={`rounded-lg px-5 h-8 text-xs font-semibold ${
                        addedUsers.has(u.uuid)
                          ? "bg-white/10 text-white/70 hover:bg-white/15"
                          : "bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white"
                      }`}
                    >
                      {addedUsers.has(u.uuid) ? "Added" : "Add"}
                    </Button>
                  </div>
                ))}
              </div>

              <p className="text-[#8E8E93] text-xs font-semibold mt-5 mb-3">Recent</p>
              <div className="flex flex-col gap-3">
                {SUGGESTED_USERS.slice(3).map((u) => (
                  <div key={u.uuid} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CustomAvatar src={u.avatar} name={u.name} className="size-10" />
                      <div>
                        <p className="text-white text-sm font-medium">{u.name}</p>
                        <p className="text-[#8E8E93] text-xs">{u.followers} followers</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toggleAddUser(u.uuid)}
                      className={`rounded-lg px-5 h-8 text-xs font-semibold ${
                        addedUsers.has(u.uuid)
                          ? "bg-white/10 text-white/70 hover:bg-white/15"
                          : "bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white"
                      }`}
                    >
                      {addedUsers.has(u.uuid) ? "Added" : "Add"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== INVITE USERS VIEW ===== */}
        {currentView === "invite-users" && (
          <div className="flex flex-col max-h-[550px]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <div className="flex items-center gap-3">
                {hasBackHistory && (
                  <button onClick={handleBack} className="p-1 hover:bg-white/5 rounded-full transition-colors">
                    <FaArrowLeft className="text-white/70 size-4" />
                  </button>
                )}
                <h2 className="text-lg font-bold text-white">Invite Users</h2>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
                <IoClose className="text-white/70 size-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 pb-4">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 h-10">
                <IoSearch className="text-white/40 size-4 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or username"
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 outline-none"
                />
              </div>
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto px-6">
              <div className="flex flex-col gap-3">
                {SUGGESTED_USERS.map((u) => (
                  <div key={u.uuid} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CustomAvatar src={u.avatar} name={u.name} className="size-10" />
                      <div>
                        <p className="text-white text-sm font-medium">{u.name}</p>
                        <p className="text-[#8E8E93] text-xs">{u.followers} followers</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toggleInviteUser(u.uuid)}
                      className={`rounded-lg px-5 h-8 text-xs font-semibold ${
                        invitedUsers.has(u.uuid)
                          ? "bg-white/10 text-white/70 hover:bg-white/15"
                          : "bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white"
                      }`}
                    >
                      {invitedUsers.has(u.uuid) ? "Invited" : "Invite"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Done button */}
            <div className="px-6 py-4">
              <Button
                onClick={handleClose}
                className="w-full h-11 bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white font-semibold rounded-xl"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {/* ===== REQUESTS VIEW ===== */}
        {currentView === "requests" && (
          <div className="flex flex-col max-h-[500px]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <div className="flex items-center gap-3">
                {hasBackHistory && (
                  <button onClick={handleBack} className="p-1 hover:bg-white/5 rounded-full transition-colors">
                    <FaArrowLeft className="text-white/70 size-4" />
                  </button>
                )}
                <h2 className="text-lg font-bold text-white">Requests</h2>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
                <IoClose className="text-white/70 size-5" />
              </button>
            </div>

            {/* Tab */}
            <div className="px-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium border-b-2 border-white pb-2">Co-host Requests</span>
                <span className="bg-[#0D52D2] text-white text-[10px] font-bold size-5 rounded-full flex items-center justify-center -mt-2">
                  {REQUEST_USERS.length}
                </span>
              </div>
            </div>

            {/* Request list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex flex-col gap-4">
                {REQUEST_USERS.map((u) => (
                  <div key={u.uuid} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CustomAvatar src={u.avatar} name={u.name} className="size-10" />
                      <div>
                        <p className="text-white text-sm font-medium">{u.name}</p>
                        <p className="text-[#8E8E93] text-xs">{u.followers} followers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="size-8 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors">
                        <IoCheckmarkCircle className="text-green-500 size-5" />
                      </button>
                      <button className="size-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors">
                        <IoCloseCircle className="text-red-500 size-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View all */}
            <div className="px-6 pb-4">
              <button className="text-[#0D52D2] text-sm font-medium hover:underline w-full text-right">
                View all requests
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HostControlModals;
