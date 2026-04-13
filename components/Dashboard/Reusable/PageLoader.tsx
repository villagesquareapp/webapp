"use client";

import LoadingSpinner from "./LoadingSpinner";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[400px]">
      <LoadingSpinner />
    </div>
  );
}
