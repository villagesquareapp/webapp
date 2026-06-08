"use client";

import React, { useState, useCallback } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import EmptyChatState from "./EmptyChatState";

interface MessagesClientProps {
  user: IUser;
}

export interface IConversation {
  uuid: string;
  initial_chat_type: string;
  display_name: string;
  display_avatar: string;
  sender_or_receiver: {
    uuid: string;
    name: string;
    username: string;
    email: string;
    verified_status: number;
    checkmark_verification_status: boolean;
    premium_verification_status: boolean;
    profile_picture: string;
    online: boolean;
    verification_badge: string;
  };
  last_message_id: string;
  last_message: string;
  last_message_type: string;
  last_message_status: string;
  last_message_at: string;
  message_sent_at: string;
  message_timestamp: string;
  unread: boolean;
  unread_count: number;
  is_pinned: boolean;
  is_archived: boolean;
}

export interface IChatMessage {
  uuid: string;
  chat_id: string;
  sender_id: string;
  unique_id: string;
  message: string;
  message_type: string;
  message_type_id: string | null;
  reply_to_message_id: string | null;
  status: string;
  message_side: "sent" | "received";
  is_pinned: boolean;
  is_flagged: boolean;
  created_at: string;
  client_timestamp: string;
  message_timestamp: string;
  media: any[];
  message_type_metadata: any | null;
}

export default function MessagesClient({ user }: MessagesClientProps) {
  const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);

  const handleSelectConversation = useCallback((conv: IConversation) => {
    setActiveConversation(conv);
  }, []);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Left: Conversation List */}
      <div className="w-[340px] shrink-0 border-r border-border h-full flex flex-col">
        <ConversationList
          user={user}
          activeId={activeConversation?.uuid ?? null}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* Right: Chat Window or Empty State */}
      <div className="flex-1 h-full overflow-hidden">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            user={user}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}
