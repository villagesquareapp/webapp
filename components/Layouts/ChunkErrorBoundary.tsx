"use client";

import React from "react";

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

export default class ChunkErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const isChunkError =
      error.name === "ChunkLoadError" ||
      error.message?.includes("Loading chunk") ||
      error.message?.includes("Failed to fetch dynamically imported module");
    return { hasError: true, isChunkError };
  }

  // componentDidCatch(error: Error) {
  //     if (
  //         error.name === "ChunkLoadError" ||
  //         error.message?.includes("Loading chunk") ||
  //         error.message?.includes("Failed to fetch dynamically imported module")
  //     ) {
  //         // Auto-reload once to pick up the new deployment chunks
  //         if (typeof window !== "undefined") {
  //             const reloadKey = "chunk_error_reload";
  //             const lastReload = sessionStorage.getItem(reloadKey);
  //             const now = Date.now();
  //             // Only auto-reload once per 30 seconds to avoid infinite loops
  //             if (!lastReload || now - Number(lastReload) > 30_000) {
  //                 sessionStorage.setItem(reloadKey, String(now));
  //                 window.location.reload();
  //             }
  //         }
  //     }
  // }

  componentDidCatch(error: Error) {
    const isChunkError =
      error.name === "ChunkLoadError" ||
      error.message?.includes("Loading chunk") ||
      error.message?.includes("Failed to fetch dynamically imported module") ||
      error.message?.includes("Importing a module script failed");

    if (isChunkError && typeof window !== "undefined") {
      const reloadKey = "chunk_error_reload";
      const hasReloaded = sessionStorage.getItem(reloadKey);

      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, "true");

        window.location.replace(window.location.href);

        return;
      }
    }
  }

  render() {
    if (this.state.hasError && !this.state.isChunkError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
          <p className="text-lg font-semibold">Something went wrong.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
