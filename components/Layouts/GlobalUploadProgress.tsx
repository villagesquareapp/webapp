'use client';

import { usePostUploadContext } from "context/PostUploadContext";
import ProgressBar from "components/Dashboard/Social/ProgressBar";

const GlobalUploadProgress = () => {
  const { status, overallProgress, cancelUpload, retryPost } = usePostUploadContext();

  if (status === "idle") return null;

  return (
    <ProgressBar
      progress={status === "success" ? 100 : overallProgress}
      onCancel={cancelUpload}
      status={status === "success" ? "uploading" : status}
      onRetry={retryPost}
    />
  );
}

export default GlobalUploadProgress;
