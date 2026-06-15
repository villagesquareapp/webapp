"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import EmptyChatState from "./EmptyChatState";
import NewChatModal from "./NewChatModal";
import { Loader2 } from "lucide-react";

interface MessagesClientProps {
  user: IUser;
  initialChatId?: string;
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
  message_date: string;
  message_time: string;
  media: any[];
  message_type_metadata: any | null;
}

export default function MessagesClient({ user, initialChatId }: MessagesClientProps) {
  const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [resolving, setResolving] = useState(!!initialChatId);
  const [showNewChatFromEmpty, setShowNewChatFromEmpty] = useState(false);
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("user");

  // Called by ConversationList when conversations are fetched
  const handleConversationsLoaded = useCallback((convs: IConversation[]) => {
    setConversations(convs);

    // If we have an initialChatId from the URL, find and select the matching conversation
    if (initialChatId && !activeConversation) {
      const match = convs.find((c) => c.uuid === initialChatId);
      if (match) {
        setActiveConversation(match);
        setResolving(false);
      } else {
        // Conversation not in the list — create a minimal one with the chatId
        // ChatWindow will fetch full data from the API using this uuid
        const tempConv: IConversation = {
          uuid: initialChatId,
          initial_chat_type: "private",
          display_name: "",
          display_avatar: "",
          sender_or_receiver: {
            uuid: "",
            name: "",
            username: "",
            email: "",
            verified_status: 0,
            checkmark_verification_status: false,
            premium_verification_status: false,
            profile_picture: "",
            online: false,
            verification_badge: "none",
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
        setActiveConversation(tempConv);
        setResolving(false);
      }
    }
  }, [initialChatId, activeConversation]);

  // Handle ?user= param — call check endpoint to get chat_id
  useEffect(() => {
    if (!targetUserId || initialChatId || activeConversation) return;

    setResolving(true);
    const checkConversation = async () => {
      try {
        const res = await fetch(`/api/messages/conversations/check/${targetUserId}`);
        const data = await res.json();
        if (data?.status && data?.data?.chat_id) {
          const chatId = data.data.chat_id;
          const match = conversations.find((c) => c.uuid === chatId);
          if (match) {
            setActiveConversation(match);
          } else {
            const tempConv: IConversation = {
              uuid: chatId,
              initial_chat_type: "private",
              display_name: "",
              display_avatar: "",
              sender_or_receiver: {
                uuid: targetUserId,
                name: "",
                username: "",
                email: "",
                verified_status: 0,
                checkmark_verification_status: false,
                premium_verification_status: false,
                profile_picture: "",
                online: false,
                verification_badge: "none",
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
            setActiveConversation(tempConv);
          }
        }
      } catch (e) {
        console.error("Failed to check conversation:", e);
      } finally {
        setResolving(false);
      }
    };

    checkConversation();
  }, [targetUserId, initialChatId, activeConversation, conversations]);

  const handleSelectConversation = useCallback((conv: IConversation) => {
    setActiveConversation(conv);
  }, []);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Left: Conversation List */}
      <div className="w-[340px] shrink-0 border-r border-border h-full flex flex-col">
        <ConversationList
          user={user}
          activeId={activeConversation?.uuid ?? initialChatId ?? null}
          onSelect={handleSelectConversation}
          onConversationsLoaded={handleConversationsLoaded}
        />
      </div>

      {/* Right: Chat Window, Loading, or Empty State */}
      <div className="flex-1 h-full overflow-hidden">
        {resolving ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            user={user}
          />
        ) : (
          <EmptyChatState onNewChat={() => setShowNewChatFromEmpty(true)} />
        )}
      </div>

      {/* New Chat Modal triggered from EmptyChatState */}
      <NewChatModal
        open={showNewChatFromEmpty}
        onClose={() => setShowNewChatFromEmpty(false)}
        onSelectUser={handleSelectConversation}
      />
    </div>
  );
}
