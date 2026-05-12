"use client";

import React, { useState, useRef, useEffect } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { IConversation, IMessage } from "./MessagesClient";
import { Phone, Video, MoreHorizontal, Paperclip, X } from "lucide-react";
import { IoSend } from "react-icons/io5";

interface Props {
  conversation: IConversation;
  user: IUser;
  messages: IMessage[];
  onSendMessage: (msg: IMessage) => void;
}

export default function ChatWindow({
  conversation,
  messages,
  onSendMessage,
}: Props) {
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [conversation.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith("video/") ? "video" : "image";
    setSelectedFile(file);
    setSelectedFileType(type);
    setSelectedPreviewUrl(URL.createObjectURL(file));
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setSelectedPreviewUrl(null);
    setSelectedFileType(null);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text && !selectedFile) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg: IMessage = {
      id: String(Date.now()),
      text,
      time,
      isMine: true,
      mediaUrl: selectedPreviewUrl ?? undefined,
      mediaType: selectedFileType ?? undefined,
    };

    onSendMessage(newMsg);
    setInput("");
    clearSelectedFile();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <CustomAvatar
              src={conversation.avatar}
              name={conversation.name}
              className="size-10"
            />
            {conversation.isOnline && (
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 border-2 border-background" />
            )}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-bold text-foreground">
              {conversation.name}
            </span>
            <span className="text-[12px] text-muted-foreground">
              @{conversation.username}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white text-[13px] font-semibold px-4 py-1.5 rounded-full transition-colors">
            View Profile
          </button>
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
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-[15px] font-semibold text-foreground text-center">
              Start a new conversation
              <br />
              with {conversation.name}
            </p>
            <span
              className="text-6xl select-none"
              role="img"
              aria-label="waving hand"
            >
              👋
            </span>
            <button
              onClick={() => {
                onSendMessage({
                  id: String(Date.now()),
                  text: "Hi",
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  isMine: true,
                });
                inputRef.current?.focus();
              }}
              className="bg-accent hover:bg-accent/80 text-foreground text-[13px] font-semibold px-5 py-2 rounded-full transition-colors"
            >
              Say Hi!
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center my-2">
              <span className="text-[12px] text-muted-foreground bg-accent px-3 py-1 rounded-full">
                Today
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
              >
                {msg.mediaUrl ? (
                  /* Media bubble */
                  <div className="relative w-48 rounded-2xl overflow-hidden">
                    {msg.mediaType === "video" ? (
                      <video
                        src={msg.mediaUrl}
                        className="w-full h-36 object-cover rounded-2xl"
                        controls
                      />
                    ) : (
                      <img
                        src={msg.mediaUrl}
                        alt="media"
                        className="w-full h-36 object-cover rounded-2xl"
                      />
                    )}
                    {/* Time + checkmark overlay */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/40 rounded-full px-2 py-0.5">
                      <span className="text-[10px] text-white/80">
                        {msg.time}
                      </span>
                      {msg.isMine && (
                        <svg
                          className="size-3 text-white/80"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M2 8l4 4 8-8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Text bubble */
                  <div
                    className={`max-w-[65%] px-4 py-2.5 rounded-full text-[14px] leading-relaxed ${
                      msg.isMine
                        ? "bg-[#0D52D2] text-white"
                        : "bg-accent text-foreground"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <span
                        className={`text-[10px] ${msg.isMine ? "text-white/60" : "text-muted-foreground"}`}
                      >
                        {msg.time}
                      </span>
                      {msg.isMine && (
                        <svg
                          className="size-3 text-white/60"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M2 8l4 4 8-8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Selected file preview — shown above input */}
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
      <div className="px-4 py-3 border-t border-border shrink-0">
        {/* Hidden file input */}
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
        <div className="flex items-center gap-3 bg-accent rounded-2xl px-4 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none border-none resize-none max-h-32 leading-relaxed"
          />
        </div>
        <button
          onClick={handleSend}
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
            className="bg-[#1C1C1E] rounded-2xl w-full max-w-[340px] mx-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <div className="flex justify-end px-4 pt-4">
              <button
                onClick={() => setShowMoreModal(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            {/* Block */}
            <button
              onClick={() => setShowBlockModal(true)}
              className="w-full py-4 text-[15px] font-medium text-foreground hover:bg-white/5 transition-colors"
            >
              Block
            </button>

            <div className="h-px bg-border mx-0" />

            {/* Report */}
            <button
              onClick={() => {
                setShowMoreModal(false);
              }}
              className="w-full py-4 text-[15px] font-medium text-foreground hover:bg-white/5 transition-colors"
            >
              Report
            </button>

            <div className="h-px bg-border mx-0" />

            {/* Cancel */}
            <button
              onClick={() => setShowMoreModal(false)}
              className="w-full py-4 text-[15px] font-medium text-red-500 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal — layered on top of More modal */}
      {showBlockModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
          onClick={() => setShowBlockModal(false)}
        >
          <div
            className="bg-[#1C1C1E] border border-border rounded-2xl w-full max-w-[300px] mx-4 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-bold text-foreground">
                Block user
              </h3>
              <button
                onClick={() => setShowBlockModal(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">
              Are you sure you want to block this user? You can unblock it
              anytime.
            </p>

            {/* Block button */}
            <button
              onClick={() => {
                setShowBlockModal(false);
                setShowMoreModal(false);
              }}
              className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-[14px] transition-colors mb-2"
            >
              Block
            </button>

            {/* Cancel */}
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
