'use client';

import { usePostUploadContext } from "context/PostUploadContext";
import ProgressBar from "components/Dashboard/Social/ProgressBar";

const GlobalUploadProgress = () => {
  const { status, overallProgress, cancelUpload, retryPost } = usePostUploadContext();

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
