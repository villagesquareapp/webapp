"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function EmptyChatState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-8">
      {/* Illustration */}
      <div className="relative">
        <Image src="/images/interaction.png" alt="Not Found" width={250} height={250} />
        {/* <div className="size-28 rounded-full bg-[#0D52D2]/10 flex items-center justify-center">
          <div className="size-20 rounded-full bg-[#0D52D2]/15 flex items-center justify-center">
            <MessageCircle className="size-10 text-[#0D52D2]" strokeWidth={1.5} />
          </div>
        </div>
        <div className="absolute -top-2 -right-2 size-8 rounded-full bg-[#0D52D2]/20 flex items-center justify-center">
          <MessageCircle className="size-4 text-[#0D52D2]" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-1 -left-3 size-6 rounded-full bg-[#0D52D2]/15" /> */}
      </div>

      <div className="text-center">
        <h3 className="text-[18px] font-bold text-foreground mb-1">Start Chatting</h3>
        <p className="text-[13px] text-muted-foreground">
          Why not catch up with a friend? Start chatting now!
        </p>
      </div>

      <button className="flex items-center gap-2 bg-[#0D52D2] hover:bg-[#0D52D2]/90 text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors">
        <MessageCircle className="size-4" />
        New Chat
      </button>
    </div>
  );
}
