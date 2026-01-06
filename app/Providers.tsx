"use client";

import { SessionProvider } from "next-auth/react";
import { PostUploadProvider } from "context/PostUploadContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PostUploadProvider>{children}</PostUploadProvider>
    </SessionProvider>
  );
}
