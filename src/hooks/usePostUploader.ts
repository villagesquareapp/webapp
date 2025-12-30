// src/hooks/usePostUploader.ts

import { useState, useCallback } from "react";
import SparkMD5 from "spark-md5";
import {
  startUploadPostGreaterThan6MB,
  uploadPostMediaGreaterThan6MB,
  completePostMediaGreaterThan6MB,
  uploadPostMediaLessThan6MB,
  createPost,
} from "api/post";

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_PARALLEL_UPLOADS = 3;
const MAX_SMALL_FILE_SIZE = 6 * 1024 * 1024;

interface UploadedPart {
  partNumber: string;
  eTag: string;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  uploadId?: string;
  parts?: UploadedPart[];
}

const calculateChecksum = async (chunk: Blob): Promise<string> => {
  try {
    const arrayBuffer = await chunk.arrayBuffer();
    return SparkMD5.ArrayBuffer.hash(arrayBuffer);
  } catch (e) {
    console.error("Checksum error:", e);
    return `${chunk.size}-${Date.now()}`;
  }
};

export const usePostUploader = (token?: string) => {
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});

  const handleLargeFileUpload = useCallback(
    async (file: File, fileId: string) => {
      try {
        const startResponse = await startUploadPostGreaterThan6MB(
          file.name,
          file.type,
          token
        );
        if (!startResponse?.status || !startResponse?.data)
          throw new Error("Failed to start multipart upload");
        const uploadId = startResponse.data.UploadId;
        if (!uploadId) throw new Error("No upload id from server");

        setUploadProgress((prev: Record<string, UploadProgress>) => ({
          ...prev,
          [fileId]: {
            file,
            progress: 0,
            status: "uploading",
            uploadId,
            parts: [],
          },
        }));

        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const uploadedParts: UploadedPart[] = [];
        const uploadPromises: Promise<any>[] = [];

        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);
          const partNumber = i + 1;
          const checksum = await calculateChecksum(chunk);

          const formData = new FormData();
          formData.append("file", chunk);
          formData.append("filename", file.name);
          formData.append("upload_id", uploadId);
          formData.append("offset", String(start));
          formData.append("part_number", String(partNumber));
          formData.append("checksum", checksum);

          const uploadPromise = uploadPostMediaGreaterThan6MB(formData, token).then(
            (res) => {
              if (res?.status && res?.data) {
                const { partNumber: pn, eTag } = res.data;
                uploadedParts.push({ partNumber: String(pn), eTag });
                const progress = (uploadedParts.length / totalChunks) * 100;
                setUploadProgress((prev: Record<string, UploadProgress>) => ({
                  ...prev,
                  [fileId]: {
                    ...(prev[fileId] || { file }),
                    progress,
                    status: "uploading",
                    uploadId,
                    parts: [...uploadedParts],
                  },
                }));
                return res;
              } else {
                throw new Error("Chunk upload failed");
              }
            }
          );
          uploadPromises.push(uploadPromise);

          if (
            uploadPromises.length >= MAX_PARALLEL_UPLOADS ||
            i === totalChunks - 1
          ) {
            await Promise.all(uploadPromises);
            uploadPromises.length = 0;
          }
        }

        const sortedParts = uploadedParts
          .sort((a, b) => Number(a.partNumber) - Number(b.partNumber))
          .map((p) => ({
            partNumber: String(p.partNumber),
            eTag: p.eTag.replace(/"/g, ""),
          }));

        const completeResponse = await completePostMediaGreaterThan6MB(
          {
            filename: file.name,
            upload_id: uploadId,
            parts: sortedParts,
          },
          token
        );

        setUploadProgress((prev: Record<string, UploadProgress>) => ({
          ...prev,
          [fileId]: {
            ...(prev[fileId] || { file }),
            progress: 100,
            status: "completed",
            uploadId,
            parts: [...sortedParts],
          },
        }));

        return completeResponse;
      } catch (err) {
        setUploadProgress((prev: Record<string, UploadProgress>) => ({
          ...prev,
          [fileId]: {
            ...(prev[fileId] || { file }),
            progress: prev[fileId]?.progress ?? 0,
            status: "error",
          },
        }));
        console.error("Large upload error", err);
        throw err;
      }
    },
    []
  );

  const uploadFileAndGetInfo = useCallback(
    async (file: File, fileId: string) => {
      if (file.size <= MAX_SMALL_FILE_SIZE) {
        const fd = new FormData();
        fd.append("file", file);
        setUploadProgress((prev: Record<string, UploadProgress>) => ({
          ...prev,
          [fileId]: { file, progress: 0, status: "uploading" },
        }));
        const uploadResponse = await uploadPostMediaLessThan6MB(fd, token);
        if (!uploadResponse?.status || !uploadResponse?.data) {
          throw new Error("Direct upload failed");
        }
        setUploadProgress((prev: Record<string, UploadProgress>) => ({
          ...prev,
          [fileId]: {
            ...(prev[fileId] || { file }),
            progress: 100,
            status: "completed",
          },
        }));
        return {
          key: uploadResponse.data.Key,
          mime_type: file.type,
        };
      } else {
        const completeResponse = await handleLargeFileUpload(file, fileId);
        if (!completeResponse?.status || !completeResponse?.data) {
          throw new Error("Chunked upload failed");
        }
        return {
          key: completeResponse.data.Key,
          mime_type: file.type,
        };
      }
    },
    [handleLargeFileUpload]
  );

  const createPostFunc = useCallback(
    async (payloadPosts: any[]) => {
      try {
        setIsPosting(true);
        const postBody = { posts: payloadPosts };
        const result = await createPost(postBody as any, token);
        if (!result?.status || !result?.data) {
          throw new Error(result?.message || "Failed to create post");
        }
        return result.data;
      } catch (err) {
        console.error("createPostFunc error", err);
        throw err;
      } finally {
        setIsPosting(false);
      }
    },
    []
  );

  return {
    isPosting,
    uploadProgress,
    uploadFileAndGetInfo,
    createPostFunc,
  };
};
