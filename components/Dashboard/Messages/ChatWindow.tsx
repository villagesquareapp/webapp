"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { IConversation, IChatMessage } from "./MessagesClient";
import { Phone, Video, MoreHorizontal, Paperclip, X } from "lucide-react";
import { IoSend } from "react-icons/io5";
import { Skeleton } from "components/ui/skeleton";
import { useMessageWebSocket } from "context/MessageWebSocketContext";
import Link from "next/link";
import { Button } from "components/ui/button";

interface Props {
  conversation: IConversation;
  user: IUser;
}

export default function ChatWindow({ conversation, user }: Props) {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState<string>(conversation.uuid); // internal chat UUID from extras.chat_data.uuid
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(
    null,
  );
  const [selectedFileType, setSelectedFileType] = useState<
    "image" | "video" | null
  >(null);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    sendMessage: wsSend,
    subscribe,
    isConnected,
    isSubscribed,
  } = useMessageWebSocket();

  // Fetch messages when conversation changes
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/chats/${conversation.uuid}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.status && data?.data) {
        // Store the real internal chat UUID from extras
        const realChatId = data.data.extras?.chat_data?.uuid;
        if (realChatId) setChatId(realChatId);

        // API returns messages in reverse chronological order, reverse for display
        const msgs: IChatMessage[] = data.data.data || [];
        setMessages(msgs.reverse());
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    } finally {
      setLoading(false);
    }
  }, [conversation.uuid]);

  const fetchMessagesSilent = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages/chats/${conversation.uuid}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.status && data?.data) {
        const msgs: IChatMessage[] = data.data.data || [];
        setMessages(msgs.reverse());
      }
    } catch (e) {
      console.error("Silent fetch failed:", e);
    }
  }, [conversation.uuid]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Subscribe to WebSocket messages
  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      if (data.event === "received-message" && data.message_data) {
        const msgData = data.message_data;
        const matches =
          msgData.chat_id === chatId ||
          msgData.chat_id === conversation.uuid ||
          msgData.sender_id === conversation.sender_or_receiver?.uuid;

        if (matches) {
          const newMsg: IChatMessage = {
            uuid: msgData.uuid,
            chat_id: msgData.chat_id,
            sender_id: msgData.receiver_id
              ? data.userId
              : msgData.sender_id || data.userId,
            unique_id: msgData.unique_id || msgData.uuid,
            message: msgData.message,
            message_type: msgData.message_type || "text",
            message_type_id: msgData.message_type_id || null,
            reply_to_message_id: msgData.reply_to_message_id || null,
            status: msgData.status || "delivered",
            message_side: "received",
            is_pinned: false,
            is_flagged: false,
            created_at: new Date().toISOString(),
            client_timestamp: msgData.client_timestamp || Date.now().toString(),
            message_timestamp:
              msgData.client_timestamp || Date.now().toString(),
            message_date: msgData.message_date || "Today",
            message_time: msgData.message_time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase(),
            media: msgData.media || [],
            message_type_metadata: null,
          };

          setMessages((prev) => {
            if (
              prev.some(
                (m) =>
                  m.unique_id === newMsg.unique_id || m.uuid === newMsg.uuid,
              )
            )
              return prev;
            return [...prev, newMsg];
          });

          wsSend({
            action: "publish",
            channel: "message",
            event: "mark-chat-as-read",
            channelId: `message_${user.uuid}`,
            userId: user.uuid,
            chatId: msgData.chat_id,
          });

          setTimeout(() => fetchMessagesSilent(), 600);
        }
      }

      if (data.event === "sent-message-v2" && data.message_data) {
        const msgData = data.message_data;
        const matches =
          msgData.chat_id === chatId ||
          msgData.chat_id === conversation.uuid ||
          msgData.receiver_id === conversation.sender_or_receiver?.uuid;

        if (matches) {
          // If receiver is online, show double tick instantly. If offline, single tick.
          const newStatus = conversation.sender_or_receiver?.online
            ? "delivered"
            : "sent";

          setMessages((prev) =>
            prev.map((m) =>
              m.unique_id === msgData.unique_id || m.uuid === msgData.uuid
                ? { ...m, uuid: msgData.uuid, status: newStatus }
                : m,
            ),
          );

          setTimeout(() => fetchMessagesSilent(), 600);
        }
      }

      // Mark chat as read (the other person read our messages)
      if (data.event === "mark-chat-as-read" && data.chatId) {
        const matches =
          data.chatId === chatId ||
          data.chatId === conversation.uuid ||
          data.userId === conversation.sender_or_receiver?.uuid;

        if (matches) {
          setMessages((prev) =>
            prev.map((m) =>
              m.message_side === "sent" && m.status !== "read"
                ? { ...m, status: "read" }
                : m,
            ),
          );
        }
      }
    });

    return unsubscribe;
  }, [subscribe, chatId, conversation.uuid, user.uuid, wsSend]);

  useEffect(() => {
    if (!loading && messages.length > 0 && conversation.unread) {
      wsSend({
        action: "publish",
        channel: "message",
        event: "mark-chat-as-read",
        channelId: `message_${user.uuid}`,
        userId: user.uuid,
        chatId: chatId,
      });
    }
  }, [
    loading,
    messages.length,
    chatId,
    conversation.unread,
    user.uuid,
    wsSend,
  ]);

  // Scroll to bottom when messages load or new message added
  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [conversation.uuid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith("video/") ? "video" : "image";
    setSelectedFile(file);
    setSelectedFileType(type);
    setSelectedPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setSelectedPreviewUrl(null);
    setSelectedFileType(null);
  };

  // Subscribe to the specific chat channel to receive `received-message` events for this chat
  useEffect(() => {
    if (isConnected && chatId) {
      wsSend({
        action: "subscribe",
        channel: "message",
        channelId: `message_${chatId}`,
        userId: user.uuid,
      });
    }
  }, [isConnected, chatId, wsSend, user.uuid]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text && !selectedFile) return;

    const msgUuid =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const now = Date.now();

    // Optimistic message — show immediately
    const optimisticMsg: IChatMessage = {
      uuid: `temp-${msgUuid}`,
      chat_id: chatId,
      sender_id: user.uuid,
      unique_id: msgUuid,
      message: text,
      message_type: "text",
      message_type_id: null,
      reply_to_message_id: null,
      status: "sending",
      message_side: "sent",
      is_pinned: false,
      is_flagged: false,
      created_at: new Date().toISOString(),
      client_timestamp: now.toString(),
      message_timestamp: now.toString(),
      message_date: "Today",
      message_time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase(),
      media: [],
      message_type_metadata: null,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");
    clearSelectedFile();
    inputRef.current?.focus();

    try {
      wsSend({
        action: "publish",
        channel: "message",
        event: "sent-message-v2",
        channelId: `message_${user.uuid}`,
        userId: user.uuid,
        message_data: {
          uuid: msgUuid,
          chat_id: chatId || "",
          receiver_id: conversation.sender_or_receiver?.uuid || "",
          message: text,
          message_type: "text",
          message_type_id: "",
          reply_to_message_id: "",
          chat_type: conversation.initial_chat_type || "private",
          status: "sent",
          client_timestamp: now.toString(),
          message_timestamp: now.toString(),
          date: true,
          media: [],
          unique_id: msgUuid,
          message_date: "",
          message_time: "",
        },
      });
      // The status will be updated to "sent" when the websocket receives the "sent-message-v2" event
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.unique_id !== msgUuid));
      console.error("Send message error:", e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce<
    { date: string; messages: IChatMessage[] }[]
  >((groups, msg) => {
    // Use message_date from API (e.g. "Today", "Yesterday", "Jun 5") or fall back to date from created_at
    const date = msg.message_date || new Date(msg.created_at).toLocaleDateString();
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({ date, messages: [msg] });
    }
    return groups;
  }, []);

  // Determine which sent messages should show a receipt (only the LAST of each status)
  // Walking from the end backwards: the latest sent message gets a receipt, then we 
  // step backwards while encountering "weaker" statuses to mark their last occurrences too.
  // Status priority: read > delivered > sent/sending
  const receiptUuids = (() => {
    const result = new Set<string>();
    let lastReadIdx = -1;
    let lastDeliveredIdx = -1;
    let lastSentIdx = -1;

    messages.forEach((m, i) => {
      if (m.message_side !== "sent") return;
      if (m.status === "read") lastReadIdx = i;
      else if (m.status === "delivered") lastDeliveredIdx = i;
      else lastSentIdx = i; // sent or sending
    });

    if (lastReadIdx >= 0) result.add(messages[lastReadIdx].uuid);
    // Only show delivered if it's after the last read
    if (lastDeliveredIdx > lastReadIdx) result.add(messages[lastDeliveredIdx].uuid);
    // Only show sent if it's after both
    if (lastSentIdx > lastReadIdx && lastSentIdx > lastDeliveredIdx) {
      result.add(messages[lastSentIdx].uuid);
    }

    return result;
  })();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <CustomAvatar
              src={conversation.display_avatar}
              name={conversation.display_name}
              className="size-10"
            />
            {conversation.sender_or_receiver?.online && (
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 border-2 border-background" />
            )}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-bold text-foreground">
              {conversation.display_name}
            </span>
            <span className="text-[12px] text-muted-foreground flex items-center gap-1">
              {isConnected ? (
                <>
                  <span className="size-1.5 rounded-full bg-green-500 inline-block" />{" "}
                  {conversation.sender_or_receiver?.online
                    ? "Online"
                    : `@${conversation.sender_or_receiver?.username}`}
                </>
              ) : (
                <>
                  <span className="size-1.5 rounded-full bg-yellow-500 inline-block" />{" "}
                  Connecting...
                </>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/u/${conversation.sender_or_receiver?.username || ""}`}>
            <Button
              size="sm"
              className={`bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white h-8 rounded-full px-5 text-xs font-semibold`}
            >
              View Profile
            </Button>
          </Link>
          <button className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <Phone className="size-4" />
          </button>
          <button className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <Video className="size-4" />
          </button>
          <button
            onClick={() => setShowMoreModal(true)}
            className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2 no-scrollbar">
        {loading ? (
          <div className="flex flex-col gap-3 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                <Skeleton
                  className={`h-10 rounded-full ${i % 2 === 0 ? "w-40" : "w-52"}`}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-[15px] font-semibold text-foreground text-center">
              Start a new conversation
              <br />
              with {conversation.display_name}
            </p>
            <span
              className="text-6xl select-none"
              role="img"
              aria-label="waving hand"
            >
              👋
            </span>
          </div>
        ) : (
          <>
            {groupedMessages.map((group) => (
              <React.Fragment key={group.date}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-3">
                  <span className="text-[12px] text-muted-foreground bg-accent px-3 py-1 rounded-full">
                    {group.date}
                  </span>
                </div>

                {group.messages.map((msg) => (
                  <div
                    key={msg.uuid}
                    className={`flex ${msg.message_side === "sent" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.media && msg.media.length > 0 ? (
                      /* Media bubble */
                      <div className="relative w-48 rounded-2xl overflow-hidden">
                        {msg.media[0]?.media_type === "video" ? (
                          <video
                            src={msg.media[0].media_url}
                            className="w-full h-36 object-cover rounded-2xl"
                            controls
                          />
                        ) : (
                          <img
                            src={
                              msg.media[0].media_url ||
                              msg.media[0].transcoded_media_url
                            }
                            alt="media"
                            className="w-full h-36 object-cover rounded-2xl"
                          />
                        )}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/40 rounded-full px-2 py-0.5">
                          {/* <span className="text-[10px] text-white/80">{msg.message_time}</span> */}
                          {msg.message_side === "sent" && receiptUuids.has(msg.uuid) && (
                            <MessageStatus status={msg.status} />
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Text bubble */
                      <div
                        className={`max-w-[480px] px-5 py-3 rounded-3xl text-[14px] leading-relaxed ${
                          msg.message_side === "sent"
                            ? "bg-[#0D52D2] text-white"
                            : "bg-[#2A2A2D] text-foreground"
                        }`}
                      >
                        <div className="flex items-end gap-3 flex-wrap">
                          <p className="whitespace-pre-wrap break-words flex-1">
                            {msg.message}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-[11px] ${msg.message_side === "sent" ? "text-white/70" : "text-muted-foreground"}`}
                            >
                              {msg.message_time}
                            </span>
                            {msg.message_side === "sent" && receiptUuids.has(msg.uuid) && (
                              <MessageStatus status={msg.status} />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Selected file preview */}
      {selectedPreviewUrl && (
        <div className="px-4 pb-2 shrink-0">
          <div className="relative w-fit">
            {selectedFileType === "video" ? (
              <video
                src={selectedPreviewUrl}
                className="h-28 rounded-xl object-cover"
              />
            ) : (
              <img
                src={selectedPreviewUrl}
                alt="preview"
                className="h-28 rounded-xl object-cover"
              />
            )}
            <button
              onClick={clearSelectedFile}
              className="absolute -top-2 -right-2 size-5 rounded-full bg-background border border-border flex items-center justify-center hover:bg-accent transition-colors"
            >
              <X className="size-3 text-foreground" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border shrink-0 flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <Paperclip className="size-5" />
        </button>
        <div className="flex-1 flex items-center bg-accent rounded-2xl px-4 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none border-none resize-none max-h-32 leading-relaxed"
          />
        </div>
        <button
          onClick={() => void handleSend()}
          disabled={!input.trim() && !selectedFile}
          className="size-9 rounded-full bg-[#0D52D2] hover:bg-[#0D52D2]/90 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <IoSend className="size-4 text-white" />
        </button>
      </div>

      {/* More Options Modal */}
      {showMoreModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowMoreModal(false)}
        >
          <div
            className="bg-background border border-border rounded-2xl w-full max-w-[340px] mx-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end px-4 pt-4">
              <button
                onClick={() => setShowMoreModal(false)}
                className="p-1 hover:bg-accent rounded-full transition-colors"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="w-full py-4 text-[15px] font-medium text-foreground hover:bg-accent/50 transition-colors"
            >
              Block
            </button>
            <div className="h-px bg-border mx-0" />
            <button
              onClick={() => setShowMoreModal(false)}
              className="w-full py-4 text-[15px] font-medium text-foreground hover:bg-accent/50 transition-colors"
            >
              Report
            </button>
            <div className="h-px bg-border mx-0" />
            <button
              onClick={() => setShowMoreModal(false)}
              className="w-full py-4 text-[15px] font-medium text-red-500 hover:bg-accent/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showBlockModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          onClick={() => setShowBlockModal(false)}
        >
          <div
            className="bg-background border border-border rounded-2xl w-full max-w-[300px] mx-4 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-bold text-foreground">
                Block user
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="p-1 hover:bg-accent rounded-full transition-colors"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">
              Are you sure you want to block this user? You can unblock them
              anytime.
            </p>
            <button
              onClick={() => {
                setShowBlockModal(false);
                setShowMoreModal(false);
              }}
              className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-[14px] transition-colors mb-2"
            >
              Block
            </button>
            <button
              onClick={() => setShowBlockModal(false)}
              className="w-full py-3 rounded-full border border-border text-foreground font-medium text-[14px] hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Message status indicator (sits inside the bubble next to the time)
// sent: single grey tick
// delivered: double grey tick
// read: white circle with grey double tick inside
function MessageStatus({ status }: { status: string }) {
  if (status === "read") {
    return (
      <div className="size-[15px] rounded-full bg-white flex items-center justify-center">
        <svg className="size-2.5 text-[#5A6878]" viewBox="0 0 20 16" fill="none">
          <path
            d="M1 8l4 4 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 8l4 4 8-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  if (status === "delivered") {
    return (
      <svg className="size-[14px] text-white/70" viewBox="0 0 20 16" fill="none">
        <path
          d="M1 8l4 4 6-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 8l4 4 8-8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // sent or sending — single tick
  return (
    <svg className="size-[12px] text-white/70" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
