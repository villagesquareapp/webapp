// src/components/Dashboard/Social/ProgressBar.tsx

import { IoClose } from "react-icons/io5";

interface ProgressBarProps {
  progress: number;
  onCancel?: () => void;
  status?: "idle" | "uploading" | "success" | "error";
  onRetry?: () => void;
}

const ProgressBar = ({ progress, onCancel, status = "uploading", onRetry }: ProgressBarProps) => {
  // Error State UI
  if (status === "error") {
    return (
      <div className="fixed top-4 left-0 right-0 z-[1000] flex justify-center px-4">
        <div className="w-full md:w-[500px] lg:w-[700px] bg-gray-900 border border-red-900/50 rounded-lg shadow-lg p-4 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-white font-medium">Uploading failed.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 left-0 md:left-[280px] z-[1000] px-0 md:px-0 pointer-events-none">
      {/* Mobile: Full width background blur? Or just the bar?
           User said: "on mobile, the progress bar should have full width"
           Desktop: "match search bar width"
       */}
      <div className="w-full md:w-[500px] lg:w-[700px] mx-auto pointer-events-auto">
        <div className="bg-background/80 backdrop-blur-md border-b md:border-x md:border-b md:rounded-b-xl shadow-lg p-4 transition-all duration-300">
          <div className="flex items-center justify-between text-sm mb-2">
            <p className="text-foreground font-medium">
              {status === "uploading" ? "Uploading post..." : "Finishing up..."}
            </p>
            <button onClick={onCancel} className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
              Cancel
            </button>
          </div>
          <div className="relative w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(5, progress)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;