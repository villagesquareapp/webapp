"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { IConversation, IChatMessage } from "./MessagesClient";
import { Phone, Video, MoreHorizontal, Paperclip, X } from "lucide-react";
import { IoSend } from "react-icons/io5";
import { Skeleton } from "components/ui/skeleton";
import { useMessageWebSocket } from "context/MessageWebSocketContext";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "components/ui/button";

interface Props {
  conversation: IConversation;
  user: IUser;
}

export default function ChatWindow({ conversation, user }: Props) {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState<string>(conversation.uuid);
  const [chatUser, setChatUser] = useState<{ name: string; username: string; profile_picture: string; online: boolean } | null>(null);
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<{ url: string; type: "image" | "video" }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({}); // msgUuid -> progress 0-100
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [mediaViewerSrc, setMediaViewerSrc] = useState<{ url: string; type: string } | null>(null);

  // Warn user before leaving page during active uploads
  useEffect(() => {
    const hasActiveUploads = Object.keys(uploadProgress).length > 0;
    const handler = (e: BeforeUnloadEvent) => {
      if (hasActiveUploads) {
        e.preventDefault();
        toast.error("Upload interrupted. Please resend the media.", { duration: 5000 });
      }
    };
    if (hasActiveUploads) {
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [uploadProgress]);
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

        // Extract the other user's info from extras
        const otherUser = data.data.extras?.user || data.data.extras?.chat_data?.user;
        if (otherUser) {
          setChatUser({
            name: otherUser.name || "",
            username: otherUser.username || "",
            profile_picture: otherUser.profile_picture || "",
            online: otherUser.online || false,
          });
        }

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
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newFiles = [...selectedFiles, ...files];
    const newPreviews = [
      ...selectedPreviews,
      ...files.map((f) => ({
        url: URL.createObjectURL(f),
        type: (f.type.startsWith("video/") ? "video" : "image") as "image" | "video",
      })),
    ];
    setSelectedFiles(newFiles);
    setSelectedPreviews(newPreviews);
    e.target.value = "";
  };

  const clearSelectedFile = () => {
    // Don't revoke URLs here — they're used by optimistic messages during upload
    // They'll be garbage collected when the blob references are gone
    setSelectedFiles([]);
    setSelectedPreviews([]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setSelectedPreviews((prev) => prev.filter((_, i) => i !== index));
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

  // Network-aware upload helper with retry on reconnection
  const uploadWithRetry = async (url: string, body: Blob | File, maxRetries = 3): Promise<Response> => {
    let attempt = 0;
    while (attempt < maxRetries) {
      // Wait for network if offline
      if (!navigator.onLine) {
        toast.error("You lost your network connection. Upload paused...", { id: "network-lost" });
        await new Promise<void>((resolve) => {
          const handler = () => { window.removeEventListener("online", handler); resolve(); };
          window.addEventListener("online", handler);
        });
        toast.success("Connection restored. Resuming upload...", { id: "network-lost" });
      }

      try {
        const res = await fetch(url, { method: "PUT", body });
        if (res.ok) return res;
        throw new Error(`Upload failed with status ${res.status}`);
      } catch (e) {
        attempt++;
        if (attempt >= maxRetries) throw e;
        // Wait before retry
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
    throw new Error("Upload failed after max retries");
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text && selectedFiles.length === 0) return;

    const msgUuid =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const now = Date.now();
    const hasMedia = selectedFiles.length > 0;
    const mediaFiles = [...selectedFiles];
    const mediaPreviews = [...selectedPreviews];

    // Optimistic message — show immediately (no forced "Video"/"Photo" text)
    const optimisticMsg: IChatMessage = {
      uuid: `temp-${msgUuid}`,
      chat_id: chatId,
      sender_id: user.uuid,
      unique_id: msgUuid,
      message: text,
      message_type: hasMedia ? "direct" : "text",
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
      media: mediaPreviews.map((p) => ({ media_url: p.url, media_type: p.type, transcoded_media_url: p.url })),
      message_type_metadata: null,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");
    clearSelectedFile();
    inputRef.current?.focus();

    // Track progress
    setUploadProgress((prev) => ({ ...prev, [msgUuid]: 0 }));

    try {
      let mediaPayload: { key: string; mime_type: string }[] = [];

      if (hasMedia) {
        const totalFiles = mediaFiles.length;
        let filesCompleted = 0;

        for (const mediaFile of mediaFiles) {
          const mimeType = mediaFile.type;
          const fileName = mediaFile.name;
          const fileSize = mediaFile.size;

          // Step 1: Get presigned URL(s)
          const presignRes = await fetch("/api/media/presign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file_size: fileSize, filename: fileName, mime_type: mimeType }),
          });
          const presignData = await presignRes.json();

          if (!presignData?.status || !presignData?.data?.parts?.length) {
            throw new Error("Failed to get presigned URL");
          }

          const { type, upload_id, s3_key, part_size, parts } = presignData.data;

          if (type === "single") {
            await uploadWithRetry(parts[0].upload_url, mediaFile);
          } else if (type === "multipart") {
            const uploadedParts: { part_number: number; e_tag: string }[] = [];
            const totalParts = parts.length;

            for (let i = 0; i < parts.length; i++) {
              const part = parts[i];
              const start = (part.part_number - 1) * part_size;
              const end = Math.min(start + part_size, fileSize);
              const chunk = mediaFile.slice(start, end);

              const uploadRes = await uploadWithRetry(part.upload_url, chunk);

              const etag = uploadRes.headers.get("ETag") || "";
              uploadedParts.push({ part_number: part.part_number, e_tag: etag });

              // Update progress based on parts completed across all files
              const partProgress = ((filesCompleted * totalParts + (i + 1)) / (totalFiles * totalParts)) * 100;
              setUploadProgress((prev) => ({ ...prev, [msgUuid]: Math.round(partProgress) }));
            }

            const completeRes = await fetch("/api/media/presign/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ upload_id, s3_key, parts: uploadedParts }),
            });
            const completeData = await completeRes.json();
            if (!completeData?.status) throw new Error("Failed to complete multipart upload");
          } else {
            // Single upload progress
            const partProgress = ((filesCompleted + 1) / totalFiles) * 100;
            setUploadProgress((prev) => ({ ...prev, [msgUuid]: Math.round(partProgress) }));
          }

          mediaPayload.push({ key: s3_key, mime_type: mimeType });
          filesCompleted++;
          setUploadProgress((prev) => ({ ...prev, [msgUuid]: Math.round((filesCompleted / totalFiles) * 100) }));
        }
      }

      // Send message via API
      const sendRes = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          receiver_id: conversation.sender_or_receiver?.uuid,
          participant_ids: [],
          message_type: "direct",
          message: text || "",
          message_type_id: "",
          reply_to_message_id: "",
          client_timestamp: now,
          message_timestamp: now,
          chat_type: conversation.initial_chat_type || "private",
          unique_id: msgUuid,
          ...(mediaPayload.length > 0 && { media: mediaPayload }),
        }),
      });

      const sendData = await sendRes.json();

      if (sendData?.status) {
        const sentMsg = sendData.data;
        setMessages((prev) =>
          prev.map((m) =>
            m.unique_id === msgUuid
              ? { ...m, uuid: sentMsg?.uuid || m.uuid, status: "sent", media: sentMsg?.media || m.media, message_time: sentMsg?.message_time || m.message_time }
              : m
          )
        );
        // Dispatch a custom event so ConversationList can update immediately
        window.dispatchEvent(new CustomEvent("message-sent", {
          detail: {
            chat_id: chatId,
            receiver_id: conversation.sender_or_receiver?.uuid,
            message: text || (mediaPayload.length > 0 ? "📷 Media" : ""),
            media: mediaPayload,
          },
        }));
      } else {
        setMessages((prev) => prev.map((m) => m.unique_id === msgUuid ? { ...m, status: "failed" } : m));
      }
    } catch (e) {
      console.error("Send message error:", e);
      setMessages((prev) => prev.map((m) => m.unique_id === msgUuid ? { ...m, status: "failed" } : m));
    } finally {
      setUploadProgress((prev) => { const n = { ...prev }; delete n[msgUuid]; return n; });
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
              src={chatUser?.profile_picture || conversation.display_avatar || conversation.sender_or_receiver?.profile_picture}
              name={chatUser?.name || conversation.display_name || conversation.sender_or_receiver?.name}
              className="size-10"
            />
            {(chatUser?.online || conversation.sender_or_receiver?.online) && (
              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-background" />
            )}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-bold text-foreground">
              {chatUser?.name || conversation.display_name || conversation.sender_or_receiver?.name}
            </span>
            <span className="text-[12px] text-muted-foreground flex items-center gap-1">
              {isConnected ? (
                <>
                  {/* <span className="size-1.5 rounded-full bg-green-500 inline-block" />{" "} */}
                  {/* {(chatUser?.online || conversation.sender_or_receiver?.online)
                    ? "Online"
                    : `@${chatUser?.username || conversation.sender_or_receiver?.username}`} */}
                    {`@${chatUser?.username}`}
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
          <Link href={`/u/${chatUser?.username || conversation.sender_or_receiver?.username || ""}`}>
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
              with {chatUser?.name || conversation.display_name || "this user"}
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
                      /* Media bubble — with optional text caption below */
                      <div className={`flex flex-col gap-1 ${msg.message_side === "sent" ? "items-end" : "items-start"}`}>
                        <div className={`relative rounded-2xl overflow-hidden ${msg.media.length > 1 ? "grid grid-cols-2 gap-1 w-64" : "w-48"}`}>
                          {msg.media.map((m: any, idx: number) => (
                            <div key={idx} className="relative cursor-pointer" onClick={() => { if (msg.status !== "sending") { setMediaViewerSrc({ url: m.media_url || m.transcoded_media_url, type: m.media_type }); setMediaViewerOpen(true); } }}>
                              {m.media_type === "video" ? (
                                <>
                                  <video src={m.media_url || m.transcoded_media_url} className="w-full h-36 object-cover rounded-xl bg-black" preload="metadata" />
                                  {/* Play icon overlay for videos */}
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="size-8 rounded-full bg-black/60 flex items-center justify-center">
                                      <svg className="size-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <img src={m.media_url || m.transcoded_media_url} alt="" className="w-full h-36 object-cover rounded-xl bg-black/20" loading="eager" />
                              )}
                            </div>
                          ))}
                          {/* Upload progress overlay */}
                          {msg.status === "sending" && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                              <svg className="size-12" viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                                <circle
                                  cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="3"
                                  strokeDasharray={`${2 * Math.PI * 20}`}
                                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - (uploadProgress[msg.unique_id] || 0) / 100)}`}
                                  strokeLinecap="round"
                                  className="transition-all duration-300"
                                  transform="rotate(-90 25 25)"
                                />
                              </svg>
                              <span className="absolute text-white text-[10px] font-bold">
                                {uploadProgress[msg.unique_id] || 0}%
                              </span>
                            </div>
                          )}
                          {!msg.message && msg.status !== "sending" && (
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/40 rounded-full px-2 py-0.5">
                              <span className="text-[10px] text-white/80">{msg.message_time}</span>
                              {msg.message_side === "sent" && <MessageStatus status={msg.status} />}
                            </div>
                          )}
                        </div>
                        {/* Text caption below media */}
                        {msg.message && (
                          <div className={`max-w-[256px] px-4 py-2 rounded-2xl text-[14px] leading-relaxed ${msg.message_side === "sent" ? "bg-[#0D52D2] text-white" : "bg-[#2A2A2D] text-foreground"}`}>
                            <div className="flex items-end gap-2 flex-wrap">
                              <p className="whitespace-pre-wrap break-words flex-1">{msg.message}</p>
                              <span className={`text-[10px] shrink-0 ${msg.message_side === "sent" ? "text-white/50" : "text-muted-foreground"}`}>{msg.message_time}</span>
                              {msg.message_side === "sent" && msg.status !== "sending" && <MessageStatus status={msg.status} />}
                            </div>
                          </div>
                        )}
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

      {/* Selected file previews */}
      {selectedPreviews.length > 0 && (
        <div className="px-4 pb-2 shrink-0 flex gap-2 overflow-x-auto no-scrollbar bg-gray-700">
          {selectedPreviews.map((preview, idx) => (
            <div key={idx} className="relative shrink-0">
              {preview.type === "video" ? (
                <video src={preview.url} className="h-20 w-20 rounded-lg object-cover" />
              ) : (
                <img src={preview.url} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
              )}
              <button
                onClick={() => removeFile(idx)}
                className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-background border border-border flex items-center justify-center hover:bg-accent transition-colors"
              >
                <X className="size-3 text-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border shrink-0 flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
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
          disabled={!input.trim() && selectedFiles.length === 0}
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

      {/* Media Viewer Modal */}
      {mediaViewerOpen && mediaViewerSrc && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setMediaViewerOpen(false)}>
          <button
            onClick={() => setMediaViewerOpen(false)}
            className="absolute top-6 right-6 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
          >
            <X className="size-5 text-white" />
          </button>
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {mediaViewerSrc.type === "video" ? (
              <video
                src={mediaViewerSrc.url}
                className="max-w-full max-h-[90vh] rounded-lg"
                controls
                autoPlay
              />
            ) : (
              <img
                src={mediaViewerSrc.url}
                alt="Full size"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            )}
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
