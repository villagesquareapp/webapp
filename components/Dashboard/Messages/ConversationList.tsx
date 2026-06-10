"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { IConversation } from "./MessagesClient";
import { Skeleton } from "components/ui/skeleton";
import { useMessageWebSocket } from "context/MessageWebSocketContext";
import { Archive, ArrowLeft, ChevronDown, Pin, Plus } from "lucide-react";
import NewChatModal from "./NewChatModal";

interface Props {
  user: IUser;
  activeId: string | null;
  onSelect: (conversation: IConversation) => void;
  onConversationsLoaded?: (conversations: IConversation[]) => void;
}

export default function ConversationList({ user, activeId, onSelect, onConversationsLoaded }: Props) {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [archivedChats, setArchivedChats] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingArchived, setLoadingArchived] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [dropdownId, setDropdownId] = useState<string | null>(null);
  const { subscribe } = useMessageWebSocket();

  const fetchChats = useCallback(async (query: string = "") => {
    try {
      const res = await fetch(`/api/messages/chats?query=${encodeURIComponent(query)}&page=1`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.status && data?.data?.data) {
        const chats = data.data.data;
        setConversations(chats);
        onConversationsLoaded?.(chats);
      }
    } catch (e) {
      console.error("Failed to fetch chats:", e);
    } finally {
      setLoading(false);
    }
  }, [onConversationsLoaded]);

  const fetchArchivedChats = useCallback(async () => {
    setLoadingArchived(true);
    try {
      const res = await fetch("/api/messages/chats/archived", { cache: "no-store" });
      const data = await res.json();
      if (data?.status && data?.data?.data) {
        setArchivedChats(data.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch archived chats:", e);
    } finally {
      setLoadingArchived(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // WebSocket listener for real-time updates
  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      if (data.event === "received-message" && data.message_data) {
        const msgData = data.message_data;

        // Update main conversation list
        setConversations((prev) => {
          const updated = prev.map((conv) => {
            const matches = conv.uuid === msgData.chat_id ||
              conv.sender_or_receiver?.uuid === msgData.sender_id;
            if (matches) {
              return {
                ...conv,
                last_message: msgData.message,
                last_message_type: "received",
                last_message_at: "Just now",
                unread: conv.uuid !== activeId,
                unread_count: conv.uuid !== activeId ? (conv.unread_count || 0) + 1 : 0,
              };
            }
            return conv;
          });
          // Move to top of unpinned section only (pinned chats stay at the top)
          const idx = updated.findIndex((c) => c.uuid === msgData.chat_id || c.sender_or_receiver?.uuid === msgData.sender_id);
          if (idx > -1 && !updated[idx].is_pinned) {
            const [chat] = updated.splice(idx, 1);
            const lastPinnedIdx = updated.reduce((acc, c, i) => c.is_pinned ? i : acc, -1);
            updated.splice(lastPinnedIdx + 1, 0, chat);
          }
          return updated;
        });

        // Also update archived chats in real-time
        setArchivedChats((prev) =>
          prev.map((conv) => {
            const matches = conv.uuid === msgData.chat_id ||
              conv.sender_or_receiver?.uuid === msgData.sender_id;
            if (matches) {
              // Don't mark as unread if this archived chat is currently being viewed
              const isViewing = conv.uuid === activeId;
              return {
                ...conv,
                last_message: msgData.message,
                last_message_type: "received",
                last_message_at: "Just now",
                unread: isViewing ? false : true,
                unread_count: isViewing ? 0 : (conv.unread_count || 0) + 1,
              };
            }
            return conv;
          })
        );
      }

      if (data.event === "sent-message-v2" && data.message_data) {
        const msgData = data.message_data;

        // Update main conversation list
        setConversations((prev) => {
          const updated = prev.map((conv) => {
            const matches = conv.uuid === msgData.chat_id ||
              conv.sender_or_receiver?.uuid === msgData.receiver_id;
            if (matches) {
              return { ...conv, last_message: msgData.message, last_message_type: "sent", last_message_at: "Just now" };
            }
            return conv;
          });
          // Move to top of unpinned section only
          const idx = updated.findIndex((c) => c.uuid === msgData.chat_id || c.sender_or_receiver?.uuid === msgData.receiver_id);
          if (idx > -1 && !updated[idx].is_pinned) {
            const [chat] = updated.splice(idx, 1);
            const lastPinnedIdx = updated.reduce((acc, c, i) => c.is_pinned ? i : acc, -1);
            updated.splice(lastPinnedIdx + 1, 0, chat);
          }
          return updated;
        });

        // Also update archived chats
        setArchivedChats((prev) =>
          prev.map((conv) => {
            const matches = conv.uuid === msgData.chat_id ||
              conv.sender_or_receiver?.uuid === msgData.receiver_id;
            if (matches) {
              return { ...conv, last_message: msgData.message, last_message_type: "sent", last_message_at: "Just now" };
            }
            return conv;
          })
        );
      }

      if (data.event === "mark-chat-as-read" && data.chatId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.uuid === data.chatId ? { ...conv, unread: false, unread_count: 0 } : conv
          )
        );
        setArchivedChats((prev) =>
          prev.map((conv) =>
            conv.uuid === data.chatId ? { ...conv, unread: false, unread_count: 0 } : conv
          )
        );
      }
    });
    return unsubscribe;
  }, [subscribe, activeId]);

  const handleShowArchived = () => {
    setShowArchived(true);
    fetchArchivedChats();
  };

  const handleSelectChat = (conv: IConversation) => {
    onSelect(conv);
    window.history.pushState(null, "", `/messages/${conv.uuid}`);
    // Clear unread locally on both lists immediately
    const clearUnread = (c: IConversation) =>
      c.uuid === conv.uuid ? { ...c, unread: false, unread_count: 0 } : c;
    setConversations((prev) => prev.map(clearUnread));
    setArchivedChats((prev) => prev.map(clearUnread));
  };

  // Also clear unread when activeId changes (covers edge cases)
  useEffect(() => {
    if (!activeId) return;
    const clearUnread = (c: IConversation) =>
      c.uuid === activeId ? { ...c, unread: false, unread_count: 0 } : c;
    setConversations((prev) => prev.map(clearUnread));
    setArchivedChats((prev) => prev.map(clearUnread));
  }, [activeId]);

  // Render skeleton loaders
  const renderSkeletons = (count: number) => (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5">
          <Skeleton className="size-11 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  );

  // Render a single conversation item
  const renderItem = (conv: IConversation, isArchived: boolean) => (
    <div
      key={conv.uuid}
      className={`relative group flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
        activeId === conv.uuid ? "bg-accent" : "hover:bg-accent/50"
      }`}
      onClick={() => handleSelectChat(conv)}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <CustomAvatar src={conv.display_avatar} name={conv.display_name} className="size-11" />
        {conv.sender_or_receiver?.online && (
          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="flex items-center gap-1 min-w-0">
            {conv.is_pinned && <Pin className="size-3 text-muted-foreground shrink-0" />}
            <span className="text-[14px] font-semibold truncate text-foreground">
              {conv.display_name}
            </span>
          </span>
          <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
            {conv.last_message_at || ""}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className={`text-[13px] truncate ${conv.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            {conv.last_message_type === "sent" && "You: "}
            {conv.last_message || "No messages yet"}
          </p>
          {conv.unread_count > 0 && (
            <span className="ml-2 shrink-0 size-5 rounded-full bg-[#0D52D2] text-white text-[10px] font-bold flex items-center justify-center">
              {conv.unread_count > 9 ? "9+" : conv.unread_count}
            </span>
          )}
        </div>
      </div>

      {/* Dropdown trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDropdownId(dropdownId === conv.uuid ? null : conv.uuid);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"
      >
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {/* Dropdown menu */}
      {dropdownId === conv.uuid && !isArchived && (
        <div
          className="absolute right-3 top-full mt-1 z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[120px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={async () => {
              const isPinned = conv.is_pinned;
              const endpoint = isPinned ? "unpin" : "pin";
              // Optimistic update
              setConversations((prev) => {
                const updated = prev.map((c) =>
                  c.uuid === conv.uuid ? { ...c, is_pinned: !isPinned } : c
                );
                // Sort: pinned first, then by original order
                return updated.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
              });
              setDropdownId(null);
              // API call
              try {
                await fetch(`/api/messages/chats/${conv.uuid}/${endpoint}`, { method: "POST" });
              } catch { }
            }}
            className="w-full px-3 py-2 text-left text-[13px] text-foreground hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Pin className="size-3.5" />
            {conv.is_pinned ? "Unpin" : "Pin"}
          </button>
          <button
            onClick={async () => {
              // Optimistic: remove from list
              const archivedConv = { ...conv, is_archived: true };
              setConversations((prev) => prev.filter((c) => c.uuid !== conv.uuid));
              setDropdownId(null);
              // API call
              try {
                await fetch(`/api/messages/chats/${conv.uuid}/archive`, { method: "POST" });
              } catch {
                // Revert on failure
                setConversations((prev) => [...prev, archivedConv]);
              }
            }}
            className="w-full px-3 py-2 text-left text-[13px] text-foreground hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Archive className="size-3.5" />
            Archive
          </button>
        </div>
      )}

      {/* Dropdown menu for archived chats — only Unarchive */}
      {dropdownId === conv.uuid && isArchived && (
        <div
          className="absolute right-3 top-full mt-1 z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[120px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={async () => {
              // Optimistic: remove from archived, add after pinned chats in main list
              const unarchivedConv = { ...conv, is_archived: false };
              setArchivedChats((prev) => prev.filter((c) => c.uuid !== conv.uuid));
              setConversations((prev) => {
                // Find the index after the last pinned chat
                const lastPinnedIdx = prev.reduce((acc, c, i) => c.is_pinned ? i : acc, -1);
                const insertIdx = lastPinnedIdx + 1;
                const updated = [...prev];
                updated.splice(insertIdx, 0, unarchivedConv);
                return updated;
              });
              setDropdownId(null);
              // API call
              try {
                await fetch(`/api/messages/chats/${conv.uuid}/unarchive`, { method: "POST" });
              } catch {
                // Revert on failure
                setArchivedChats((prev) => [...prev, conv]);
                setConversations((prev) => prev.filter((c) => c.uuid !== conv.uuid));
              }
            }}
            className="w-full px-3 py-2 text-left text-[13px] text-foreground hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Archive className="size-3.5" />
            Unarchive
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border shrink-0">
        {showArchived ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowArchived(false)}
              className="p-1 hover:bg-accent rounded-full transition-colors"
            >
              <ArrowLeft className="size-5 text-foreground" />
            </button>
            <h2 className="text-[18px] font-bold text-foreground">Archived Chats</h2>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-foreground">Chats</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShowArchived}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Archived chats"
              >
                <Archive className="size-4" />
              </button>
              <button
                onClick={() => setShowNewChat(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="New Chat"
              >
                <Plus className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* List content */}
      <div className="flex-1 overflow-y-auto no-scrollbar" onClick={() => setDropdownId(null)}>
        {showArchived ? (
          // Archived chats
          loadingArchived ? renderSkeletons(3) : archivedChats.length > 0 ? (
            archivedChats.map((conv) => renderItem(conv, true))
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              No archived chats
            </div>
          )
        ) : (
          // Regular chats
          loading ? renderSkeletons(5) : conversations.length > 0 ? (
            conversations.map((conv) => renderItem(conv, false))
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              No messages yet
            </div>
          )
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        open={showNewChat}
        onClose={() => setShowNewChat(false)}
        onSelectUser={onSelect}
      />
    </div>
  );
}
