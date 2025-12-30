"use server";

import { apiGet, apiPost } from "lib/api";
import { getToken } from "lib/getToken";

interface GetPostsParams {
  order?: "latest";
  location?: string;
  include?: string;
  page?: number;
}

const resolveToken = async (providedToken?: string) => {
  if (providedToken) return providedToken;
  if (typeof window === "undefined") {
    return await getToken();
  }
  return undefined;
};

export async function getPosts(params: GetPostsParams = {}, token?: string) {
  const resolvedToken = await resolveToken(token);
  const queryParams = new URLSearchParams();

  if (params.order) queryParams.append("order", params.order);
  if (params.location) queryParams.append("location", params.location);
  if (params.include) queryParams.append("include", params.include);
  if (params.page) queryParams.append("page", params.page.toString());

  const route = `/posts/social/foryou?${queryParams.toString()}`;

  const response = await apiGet<IPostsResponse>(route, resolvedToken);
  // console.log("Response from API: ", response);
  if (!response.status) {
    console.error("Error fetching posts:", response.message);
    return null;
  }
  return response.data || null;
}

// Add this to your app/api/post.ts file

export async function getFollowingPosts(
  params: GetPostsParams = {},
  token?: string
) {
  const resolvedToken = await resolveToken(token);
  const queryParams = new URLSearchParams();

  if (params.order) queryParams.append("order", params.order);
  if (params.location) queryParams.append("location", params.location);
  if (params.include) queryParams.append("include", params.include);
  if (params.page) queryParams.append("page", params.page.toString());

  const route = `/posts/social/following?${queryParams.toString()}`;

  const response = await apiGet<IPostsResponse>(route, resolvedToken);
  
  if (!response.status) {
    console.error("Error fetching following posts:", response.message);
    return null;
  }
  return response.data || null;
}

export async function createPost(newPost: INewPost, token?: string) {
  const resolvedToken = await resolveToken(token);
  return await apiPost<INewPostResponse>(`/posts/create`, newPost, resolvedToken);
}

export async function getPostDetails(postId: string, token?: string) {
  const resolvedToken = await resolveToken(token);
  const response = await apiGet(`posts/${postId}`, resolvedToken);
  return response;
}

export async function likeOrUnlikePost(
  postId: string,
  formData?: FormData,
  token?: string
) {
  const resolvedToken = await resolveToken(token);
  return await apiPost<ILikeOrUnlikePostResponse>(
    `/posts/${postId}/like`,
    {
      body: formData,
      isFormData: true,
    },
    resolvedToken
  );
}

export async function saveOrUnsavePost(
  postId: string,
  formData?: FormData,
  token?: string
) {
  const resolvedToken = await resolveToken(token);
  return await apiPost<ISaveOrUnsavePostResponse>(
    `/posts/${postId}/save`,
    formData,
    resolvedToken
  );
}

export async function sharePost(postId: string, token?: string) {
  const resolvedToken = await resolveToken(token);
  return await apiPost(`/posts/${postId}/share`, {}, resolvedToken);
}

// ============== Comments =================

export const getPostComments = async (
  postId: string,
  page: number = 1,
  token?: string
) => {
  const resolvedToken = await resolveToken(token);
  const response = await apiGet<ICommentsResponse>(
    `posts/${postId}/replies?page=${page}`,
    resolvedToken
  );
  return response;
};

// export const createComments = async (
//   postId: string,
//   newCommentData: INewComment
// ) => {
//   const token = await getToken();
//   const response = await apiPost<IPostComment>(
//     `posts/${postId}/comments/add`,
//     newCommentData,
//     token
//   );
//   return response;
// };

export const getCommentReplies = async (
  postId: string,
  commentId: string,
  page: number = 1,
  token?: string
) => {
  const resolvedToken = await resolveToken(token);
  const response = await apiGet<ICommentsResponse>(
    `posts/${postId}/comments/${commentId}?page=${page}`,
    resolvedToken
  );
  return response;
};

export async function likeOrUnlikeComments(
  postId: string,
  commentId: string,
  formData: FormData,
  token?: string
) {
  const resolvedToken = await resolveToken(token);
  return await apiPost<ILikeOrUnlikePostResponse>(
    `/posts/${postId}/comments/${commentId}/like`,
    formData,
    resolvedToken
  );
}

export const uploadPostMediaLessThan6MB = async (
  formData: FormData,
  token?: string
) => {
  const resolvedToken = await resolveToken(token);
  const response = await apiPost<IFileUploadCompleteResponse>(
    `posts/upload/single`,
    formData,
    resolvedToken
  );
  return response;
};

export const startUploadPostGreaterThan6MB = async (
  filename: string,
  mime_type: string,
  token?: string
) => {
  const resolvedToken = await resolveToken(token);
  const response = await apiPost<IFileUploadStartResponse>(
    `posts/upload/start`,
    {
      filename,
      mime_type,
    },
    resolvedToken
  );
  return response;
};

export const uploadPostMediaGreaterThan6MB = async (
  formData: FormData,
  token?: string
) => {
  const resolvedToken = await resolveToken(token);
  const response = await apiPost<IFileUploadChunkResponse>(
    `posts/upload/chunk`,
    formData,
    resolvedToken
  );
  return response;
};

export const completePostMediaGreaterThan6MB = async (
  fileUploadCompleteBody: IFileUploadCompleteBody,
  token?: string
) => {
  const resolvedToken = await resolveToken(token);
  const response = await apiPost<IFileUploadCompleteResponse>(
    `posts/upload/complete`,
    fileUploadCompleteBody,
    resolvedToken
  );
  return response;
};
