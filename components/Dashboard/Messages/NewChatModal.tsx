"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { IoSearch } from "react-icons/io5";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Skeleton } from "components/ui/skeleton";
import { IConversation } from "./MessagesClient";
import { useRouter } from "next/navigation";

interface SearchUser {
  uuid: string;
  name: string;
  username: string;
  profile_picture: string;
  verified_status: number;
  verification_badge: string;
  online?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectUser: (conversation: IConversation) => void;
}

export default function NewChatModal({ open, onClose, onSelectUser }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const searchUsers = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data?.status && data?.data) {
        setResults(Array.isArray(data.data) ? data.data : data.data.data || []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally { 
      setLoading(false);
    }
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchUsers(val), 300);
  };

  const handleSelectUser = async (user: SearchUser) => {
    setChecking(true);
    try {
      const res = await fetch(`/api/messages/conversations/check/${user.uuid}`);
      const data = await res.json();

      if (data?.status && data?.data?.chat_id) {
        const chatId = data.data.chat_id;

        const conv: IConversation = {
          uuid: chatId,
          initial_chat_type: "private",
          display_name: user.name,
          display_avatar: user.profile_picture,
          sender_or_receiver: {
            uuid: user.uuid,
            name: user.name,
            username: user.username,
            email: "",
            verified_status: user.verified_status,
            checkmark_verification_status: false,
            premium_verification_status: false,
            profile_picture: user.profile_picture,
            online: user.online || false,
            verification_badge: user.verification_badge || "none",
          },
          last_message_id: "",
          last_message: "",
          last_message_type: "",
          last_message_status: "",
          last_message_at: "",
          message_sent_at: "",
          message_timestamp: "",
          unread: false,
          unread_count: 0,
          is_pinned: false,
          is_archived: false,
        };

        onSelectUser(conv);
        router.push(`/messages/${chatId}`);
      }
    } catch (e) {
      console.error("Failed to check conversation:", e);
    } finally {
      setChecking(false);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-2xl w-full max-w-[420px] mx-4 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-[16px] font-bold text-foreground">New Chat</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-full transition-colors"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Search input */}
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search users..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full h-10 bg-accent/50 rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none border-none"
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[350px] overflow-y-auto no-scrollbar relative">
          {checking && (
            <div className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                Opening chat...
              </div>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col p-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <Skeleton className="size-10 rounded-full shrink-0" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col p-2">
              {results.map((user) => (
                <button
                  key={user.uuid}
                  onClick={() => handleSelectUser(user)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left w-full"
                >
                  <div className="relative shrink-0">
                    <CustomAvatar
                      src={user.profile_picture}
                      name={user.name}
                      className="size-10"
                    />
                    {user.online && (
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      @{user.username}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              Search for a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
