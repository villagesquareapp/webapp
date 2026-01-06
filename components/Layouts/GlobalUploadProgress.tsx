'use client';

// Separate component to use hook
import { usePostUploadContext } from "context/PostUploadContext";
import ProgressBar from "components/Dashboard/Social/ProgressBar";

const GlobalUploadProgress = () => {
  const { isPosting, uploadProgress, overallProgress, cancelUpload } = usePostUploadContext();

  const hasActiveUploads = Object.keys(uploadProgress).length > 0;

  if (!isPosting && !hasActiveUploads) return null;

  return <ProgressBar progress={overallProgress} onCancel={cancelUpload} />;
}

export default GlobalUploadProgress;
