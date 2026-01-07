'use client';

// Separate component to use hook
import { usePostUploadContext } from "context/PostUploadContext";
import ProgressBar from "components/Dashboard/Social/ProgressBar";

const GlobalUploadProgress = () => {
  const { status, overallProgress, cancelUpload, retryPost } = usePostUploadContext();

  // Show if uploading OR error
  if (status !== "uploading" && status !== "error") return null;

  return (
    <ProgressBar
      progress={overallProgress}
      onCancel={cancelUpload}
      status={status}
      onRetry={retryPost}
    />
  );
}

export default GlobalUploadProgress;
