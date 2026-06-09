"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { IConversation } from "./MessagesClient";
import { Skeleton } from "components/ui/skeleton";
import { useMessageWebSocket } from "context/MessageWebSocketContext";

interface Props {
  user: IUser;
  activeId: string | null;
  onSelect: (conversation: IConversation) => void;
}

export default function ConversationList({ user, activeId, onSelect }: Props) {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { subscribe } = useMessageWebSocket();

  const fetchChats = useCallback(async (query: string = "") => {
    try {
      const res = await fetch(`/api/messages/chats?query=${encodeURIComponent(query)}&page=1`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.status && data?.data?.data) {
        setConversations(data.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch chats:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Listen for incoming messages to update conversation list
  useEffect(() => {
    const unsubscribe = subscribe((data) => {

      if (data.event === "received-message" && data.message_data) {
        const msgData = data.message_data;
        setConversations((prev) => {
          let found = false;
          const updated = prev.map((conv) => {
            const matches = conv.uuid === msgData.chat_id || 
                            conv.sender_or_receiver?.uuid === msgData.sender_id || 
                            conv.sender_or_receiver?.uuid === msgData.receiver_id;
            if (matches) {
              found = true;
              return {
                ...conv,
                last_message: msgData.message,
                last_message_type: "received",
                last_message_at: "Just now",
                message_sent_at: new Date().toISOString(),
                unread: conv.uuid !== activeId && conv.sender_or_receiver?.uuid !== activeId,
                unread_count: conv.uuid !== activeId && conv.sender_or_receiver?.uuid !== activeId ? (conv.unread_count || 0) + 1 : 0,
              };
            }
            return conv;
          });
          
          if (found) {
            const chatIndex = updated.findIndex((c) => c.uuid === msgData.chat_id || c.sender_or_receiver?.uuid === msgData.sender_id || c.sender_or_receiver?.uuid === msgData.receiver_id);
            if (chatIndex > 0) {
              const [chat] = updated.splice(chatIndex, 1);
              updated.unshift(chat);
            }
            return updated;
          }
          return prev;
        });

        // Always do a silent re-fetch to catch new conversations not yet in memory
        setTimeout(() => fetchChats(""), 800);
      }

      if (data.event === "sent-message-v2" && data.message_data) {
        const msgData = data.message_data;
        setConversations((prev) => {
          let found = false;
          const updated = prev.map((conv) => {
            const matches = conv.uuid === msgData.chat_id || 
                            conv.sender_or_receiver?.uuid === msgData.sender_id || 
                            conv.sender_or_receiver?.uuid === msgData.receiver_id;
            if (matches) {
              found = true;
              return {
                ...conv,
                last_message: msgData.message,
                last_message_type: "sent",
                last_message_at: "Just now",
                message_sent_at: new Date().toISOString(),
              };
            }
            return conv;
          });
          
          if (found) {
            const chatIndex = updated.findIndex((c) => c.uuid === msgData.chat_id || c.sender_or_receiver?.uuid === msgData.sender_id || c.sender_or_receiver?.uuid === msgData.receiver_id);
            if (chatIndex > 0) {
              const [chat] = updated.splice(chatIndex, 1);
              updated.unshift(chat);
            }
            return updated;
          }
          return prev;
        });

        // Silent re-fetch to sync ordering + last_message from DB
        setTimeout(() => fetchChats(""), 800);
      }

      if (data.event === "mark-chat-as-read" && data.chatId) {
        setConversations((prev) =>
          prev.map((conv) => {
            const matches = conv.uuid === data.chatId || conv.sender_or_receiver?.uuid === data.userId;
            return matches
              ? { ...conv, unread: false, unread_count: 0 }
              : conv;
          })
        );
      }
    });

    return unsubscribe;
  }, [subscribe, activeId, fetchChats]);

  // Debounced search
  useEffect(() => {
    if (searchQuery === "") return;
    const timeout = setTimeout(() => {
      setLoading(true);
      fetchChats(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, fetchChats]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setLoading(true);
      fetchChats("");
    }
  };

  // Format relative time from message_sent_at
  const formatTime = (conv: IConversation) => {
    // Use last_message_at if available (already formatted from backend)
    if (conv.last_message_at) return conv.last_message_at;
    return "";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border shrink-0">
        <h2 className="text-[20px] font-bold text-foreground mb-3">Chats</h2>
        {/* Search */}
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full h-9 bg-accent/50 rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border-none"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="flex flex-col">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <Skeleton className="size-11 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conv) => (
            <button
              key={conv.uuid}
              onClick={() => onSelect(conv)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left ${
                activeId === conv.uuid
                  ? "bg-accent"
                  : "hover:bg-accent/50"
              }`}
            >
              {/* Avatar with online dot */}
              <div className="relative shrink-0">
                <CustomAvatar
                  src={conv.display_avatar}
                  name={conv.display_name}
                  className="size-11"
                />
                {conv.sender_or_receiver?.online && (
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-background" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[14px] font-semibold truncate ${conv.unread ? "text-foreground" : "text-foreground"}`}>
                    {conv.display_name}
                  </span>
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                    {formatTime(conv)}
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
            </button>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            {searchQuery ? "No conversations found" : "No messages yet"}
          </div>
        )}
      </div>
    </div>
  );
}
