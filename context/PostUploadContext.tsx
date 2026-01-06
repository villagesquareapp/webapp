"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import SparkMD5 from "spark-md5";
import {
    startUploadPostGreaterThan6MB,
    uploadPostMediaGreaterThan6MB,
    completePostMediaGreaterThan6MB,
    uploadPostMediaLessThan6MB,
    createPost,
} from "api/post";
import { toast } from "sonner";

// Re-using types from hook
const CHUNK_SIZE = 2 * 1024 * 1024; 
const MAX_PARALLEL_UPLOADS = 3;
const MAX_SMALL_FILE_SIZE = 3 * 1024 * 1024; 

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

interface PostUploadContextType {
    isPosting: boolean;
    uploadProgress: Record<string, UploadProgress>;
    uploadFileAndGetInfo: (file: File, fileId: string) => Promise<{ key: string; mime_type: string }>;
    createPostFunc: (payloadPosts: any[]) => Promise<any>;
    cancelUpload: () => void;
    overallProgress: number;
}

const PostUploadContext = createContext<PostUploadContextType | undefined>(undefined);

const calculateChecksum = async (chunk: Blob): Promise<string> => {
    try {
        const arrayBuffer = await chunk.arrayBuffer();
        return SparkMD5.ArrayBuffer.hash(arrayBuffer);
    } catch (e) {
        console.error("Checksum error:", e);
        return `${chunk.size}-${Date.now()}`;
    }
};

export const PostUploadProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const overallProgress = useMemo(() => {
        const fileKeys = Object.keys(uploadProgress);
        if (fileKeys.length === 0) return 0;
        const totalProgress = fileKeys.reduce(
            (sum, key) => sum + (uploadProgress[key]?.progress || 0),
            0
        );
        return totalProgress / fileKeys.length;
    }, [uploadProgress]);

    const cancelUpload = useCallback(() => {
        if (abortController) {
            abortController.abort();
        }
        setIsPosting(false);
        setUploadProgress({});
        toast.info("Upload cancelled");
    }, [abortController]);

    const handleLargeFileUpload = useCallback(
        async (file: File, fileId: string) => {
            try {
                const startResponse = await startUploadPostGreaterThan6MB(file.name, file.type);
                if (!startResponse?.status || !startResponse?.data)
                    throw new Error("Failed to start multipart upload");
                const uploadId = startResponse.data.UploadId;
                if (!uploadId) throw new Error("No upload id from server");

                setUploadProgress((prev) => ({
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

                    const uploadPromise = uploadPostMediaGreaterThan6MB(formData).then(
                        (res) => {
                            if (res?.status && res?.data) {
                                const { partNumber: pn, eTag } = res.data;
                                uploadedParts.push({ partNumber: String(pn), eTag });
                                const progress = (uploadedParts.length / totalChunks) * 100;
                                setUploadProgress((prev) => ({
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

                const completeResponse = await completePostMediaGreaterThan6MB({
                    filename: file.name,
                    upload_id: uploadId,
                    parts: sortedParts,
                });

                setUploadProgress((prev) => ({
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
                setUploadProgress((prev) => ({
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
            // Reset or init specific file progress
            setUploadProgress((prev) => ({
                ...prev,
                [fileId]: { file, progress: 0, status: 'pending' }
            }));

            // NOTE: We could use AbortController here if we want to support true cancellation of fetch requests
            // For now, simple state reset is implemented.

            if (file.size <= MAX_SMALL_FILE_SIZE) {
                const fd = new FormData();
                fd.append("file", file);
                setUploadProgress((prev) => ({
                    ...prev,
                    [fileId]: { ...prev[fileId], status: "uploading" },
                }));

                const uploadResponse = await uploadPostMediaLessThan6MB(fd);
                if (!uploadResponse?.status || !uploadResponse?.data) {
                    throw new Error("Direct upload failed");
                }
                setUploadProgress((prev) => ({
                    ...prev,
                    [fileId]: {
                        ...prev[fileId],
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
                // Start a fresh abort controller (not fully used yet but good practice)
                setAbortController(new AbortController());

                const postBody = { posts: payloadPosts };

                // Using existing API client wrapper
                const res = await fetch("/api/posts/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postBody),
                });
                const result = await res.json();

                if (!result?.status || !result?.data) {
                    throw new Error(result?.message || "Failed to create post");
                }

                // Clear progress after success (maybe delay slighly for UX?)
                setTimeout(() => {
                    setUploadProgress({});
                    setIsPosting(false);
                }, 1000);

                return result.data;
            } catch (err) {
                console.error("createPostFunc error", err);
                setIsPosting(false); // Stop posting state on error
                throw err;
            }
        },
        []
    );

    return (
        <PostUploadContext.Provider
            value={{
                isPosting,
                uploadProgress,
                uploadFileAndGetInfo,
                createPostFunc,
                cancelUpload,
                overallProgress
            }}
        >
            {children}
        </PostUploadContext.Provider>
    );
};

export const usePostUploadContext = () => {
    const context = useContext(PostUploadContext);
    if (context === undefined) {
        throw new Error("usePostUploadContext must be used within a PostUploadProvider");
    }
    return context;
};
