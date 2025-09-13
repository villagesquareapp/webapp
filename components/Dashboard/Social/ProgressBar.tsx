// src/components/Dashboard/Social/ProgressBar.tsx

import { IoClose } from "react-icons/io5";

interface ProgressBarProps {
  progress: number;
  onCancel?: () => void;
}

const ProgressBar = ({ progress, onCancel }: ProgressBarProps) => {
  return (
    <div className="fixed inset-x-0 top-0 z-[999] bg-background/50 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between text-white/80 max-w-2xl mx-auto">
        <p>Uploading post...</p>
        {onCancel && (
          <button onClick={onCancel} className="text-blue-500 hover:text-blue-400">
            Cancel
          </button>
        )}
      </div>
      <div className="relative w-full h-1 bg-gray-700 rounded-full mt-2 max-w-2xl mx-auto">
        <div
          className="h-1 bg-blue-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;