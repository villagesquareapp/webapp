"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import SparkMD5 from "spark-md5";
// import {
//     startUploadPostGreaterThan6MB,
//     uploadPostMediaGreaterThan6MB,
//     completePostMediaGreaterThan6MB,
//     uploadPostMediaLessThan6MB,
//     createPost,
// } from "api/post";
import { toast } from "sonner";

// Re-using types from hook
import { getSession } from "next-auth/react";
import { baseApiCall } from "lib/api/base";

const CHUNK_SIZE = 6 * 1024 * 1024; 
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

    // Helper to get token client-side if needed, but we can't use getToken from lib/getToken because it uses headers()
    // We'll use getSession from next-auth/react


    const getClientToken = async () => {
        const session = await getSession();
        // @ts-ignore
        return session?.user?.token;
    }

    const handleLargeFileUpload = useCallback(
        async (file: File, fileId: string) => {
            try {
                const token = await getClientToken();
                if (!token) throw new Error("No authentication token found");

                // Start Upload
                const startResponse = await baseApiCall<any>("POST", "posts/upload/start", {
                    body: JSON.stringify({
                        filename: file.name,
                        mime_type: file.type,
                    })
                }, token);

                if (!startResponse?.status || !startResponse?.data)
                    throw new Error("Failed to start multipart upload: " + startResponse.message);
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

                    // Upload Chunk
                    const uploadPromise = baseApiCall<any>("POST", "posts/upload/chunk", {
                        body: formData,
                        isFormData: true
                    }, token).then(
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
                                throw new Error("Chunk upload failed: " + res.message);
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

                // Complete Upload
                const completeResponse = await baseApiCall<any>("POST", "posts/upload/complete", {
                    body: JSON.stringify({
                        filename: file.name,
                        upload_id: uploadId,
                        parts: sortedParts,
                    })
                }, token);

                if (!completeResponse?.status) {
                    throw new Error("Failed to complete upload: " + completeResponse.message);
                }

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
            } catch (err: any) {
                setUploadProgress((prev) => ({
                    ...prev,
                    [fileId]: {
                        ...(prev[fileId] || { file }),
                        progress: prev[fileId]?.progress ?? 0,
                        status: "error",
                    },
                }));
                console.error("Large upload error", err);
                toast.error(`Upload error: ${err.message}`);
                throw err;
            }
        },
        []
    );

    const uploadFileAndGetInfo = useCallback(
        async (file: File, fileId: string) => {
            const token = await getClientToken();
            if (!token) throw new Error("No authentication token found");

            // Reset or init specific file progress
            setUploadProgress((prev) => ({
                ...prev,
                [fileId]: { file, progress: 0, status: 'pending' }
            }));

            if (file.size <= MAX_SMALL_FILE_SIZE) {
                const fd = new FormData();
                fd.append("file", file);
                setUploadProgress((prev) => ({
                    ...prev,
                    [fileId]: { ...prev[fileId], status: "uploading" },
                }));

                // Direct Upload
                const uploadResponse = await baseApiCall<any>("POST", "posts/upload/single", {
                    body: fd,
                    isFormData: true
                }, token);

                if (!uploadResponse?.status || !uploadResponse?.data) {
                    throw new Error("Direct upload failed: " + uploadResponse.message);
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
