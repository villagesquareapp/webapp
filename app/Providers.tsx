"use client";

import { SessionProvider } from "next-auth/react";
import { PostUploadProvider } from "context/PostUploadContext";
import { MessageWebSocketProvider } from "context/MessageWebSocketContext";
import ChunkErrorBoundary from "components/Layouts/ChunkErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChunkErrorBoundary>
      <SessionProvider>
        <MessageWebSocketProvider>
          <PostUploadProvider>{children}</PostUploadProvider>
        </MessageWebSocketProvider>
      </SessionProvider>
    </ChunkErrorBoundary>
  );
}
