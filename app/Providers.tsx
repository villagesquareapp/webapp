"use client";

import { SessionProvider } from "next-auth/react";
import { PostUploadProvider } from "context/PostUploadContext";
import ChunkErrorBoundary from "components/Layouts/ChunkErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChunkErrorBoundary>
      <SessionProvider>
        <PostUploadProvider>{children}</PostUploadProvider>
      </SessionProvider>
    </ChunkErrorBoundary>
  );
}
