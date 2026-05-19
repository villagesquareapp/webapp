"use client";

import React, { useState, useEffect } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { IConversation } from "./MessagesClient";

// Mock data — replace with real API when ready
const MOCK_CONVERSATIONS: IConversation[] = [
  {
    id: "1",
    name: "Benny.J",
    username: "benny.j",
    avatar: "https://cdn-assets.villagesquare.io/profile_pictures/default_user.png",
    lastMessage: "Hey....wanna go see a movie?",
    time: "09:40 pm",
    isOnline: true,
  },
  {
    id: "2",
    name: "Olamilekan Jerald",
    username: "olamilekan",
    avatar: "https://cdn-assets.villagesquare.io/profile_pictures/default_user.png",
    lastMessage: "Can i get the PRD for google architecture",
    time: "2d ago",
    isOnline: false,
  },
  {
    id: "3",
    name: "Lamborghini_",
    username: "lamborghini_",
    avatar: "https://cdn-assets.villagesquare.io/profile_pictures/default_user.png",
    lastMessage: "What are the features of the new Huracan",
    time: "1month ago",
    isOnline: false,
  },
];

interface Props {
  user: IUser;
  activeId: string | null;
  onSelect: (conversation: IConversation) => void;
}

export default function ConversationList({ user, activeId, onSelect }: Props) {
  const [conversations] = useState<IConversation[]>(MOCK_CONVERSATIONS);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border shrink-0">
        <h2 className="text-[20px] font-bold text-foreground">Chats</h2>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left ${
              activeId === conv.id
                ? "bg-accent"
                : "hover:bg-accent/50"
            }`}
          >
            {/* Avatar with online dot */}
            <div className="relative shrink-0">
              <CustomAvatar
                src={conv.avatar}
                name={conv.name}
                className="size-11"
              />
              {conv.isOnline && (
                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[14px] font-semibold text-foreground truncate">
                  {conv.name}
                </span>
                <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                  {conv.time}
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground truncate">
                {conv.lastMessage}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
