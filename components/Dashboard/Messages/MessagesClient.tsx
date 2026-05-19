"use client";

import React, { useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import EmptyChatState from "./EmptyChatState";

interface MessagesClientProps {
  user: IUser;
}

export interface IConversation {
  id: string;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  isOnline?: boolean;
  unreadCount?: number;
}

export interface IMessage {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

export default function MessagesClient({ user }: MessagesClientProps) {
  const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);
  // Per-conversation message store — keyed by conversation id
  const [messagesByConv, setMessagesByConv] = useState<Record<string, IMessage[]>>({});

  const addMessage = (conversationId: string, msg: IMessage) => {    setMessagesByConv((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] ?? []), msg],
    }));
  };

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Left: Conversation List */}
      <div className="w-[340px] shrink-0 border-r border-border h-full flex flex-col">
        <ConversationList
          user={user}
          activeId={activeConversation?.id ?? null}
          onSelect={setActiveConversation}
        />
      </div>

      {/* Right: Chat Window or Empty State */}
      <div className="flex-1 h-full overflow-hidden">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            user={user}
            messages={messagesByConv[activeConversation.id] ?? []}
            onSendMessage={(msg) => addMessage(activeConversation.id, msg)}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}
