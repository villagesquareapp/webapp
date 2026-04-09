'use server';

import { apiGet, apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export interface ICreateVflixPayload {
  media: {
    key: string;
    mime_type: string;
  }[];
  caption: string;
  privacy: string;
  allow_comments: boolean;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  language: string;
  culture_tag: string | null;
  audio_id: string | null;
  series_id: string | null;
  episode_number: string | null;
}

export const createVflixPost = async (payload: ICreateVflixPayload) => {
  const token = await getToken();
  const response = await apiPost<any>(
    `/vflix/create`,
    payload,
    token
  );
  return response;
};

export const getVflixPosts = async (page: number) => {
  const token = await getToken();

  const params = new URLSearchParams({
    page: String(page),
  })

  const response = await apiGet<IVFlixResponse>(
    `/posts/vflix/foryou?${params.toString()}`,
    token
  );
  return response;
};

export async function likeOrUnlikeVflix(postId: string, source?: string) {
  const token = await getToken();
  const endpoint = source === "legacy"
    ? `vflix/${postId}/like?source=legacy`
    : `vflix/${postId}/like`;
  return await apiPost<ILikeOrUnlikeVflixResponse>(endpoint, {}, token);
};

export const getVflixComments = async (postId: string, page: number = 1, source?: string) => {
  const token = await getToken();
  const endpoint = source === "legacy"
    ? `vflix/${postId}/comments?page=${page}&source=legacy`
    : `vflix/${postId}/comments?page=${page}`;
  const response = await apiGet<IGetVflixCommentResponse>(endpoint, token);
  return response;
};

export const createVflixComment = async (
  postId: string,
  newCommentData: INewVflixComment,
  source?: string
) => {
  const token = await getToken();
  const endpoint = source === "legacy"
    ? `vflix/${postId}/comments?source=legacy`
    : `vflix/${postId}/comments`;
  const response = await apiPost<INewVflixCommentResponse>(endpoint, newCommentData, token);
  return response;
};

export const likeOrUnlikeVflixComment = async (
  postId: string,
  uuid: string,
  formData: FormData,
  source?: string
) => {
  const token = await getToken();
  const endpoint = source === "legacy"
    ? `vflix/comments/${uuid}/like?source=legacy`
    : `vflix/comments/${uuid}/like`;
  const response = await apiPost<ILikeOrUnlikeVflixCommentResponse>(
    endpoint,
    { body: formData, isFormData: true },
    token
  );
  return response;
};

export const getVflixReplies = async (postId: string, commentId: string, page: number = 1, source?: string) => {
  const token = await getToken();
  const endpoint = source === "legacy"
    ? `vflix/${postId}/comments/${commentId}/replies?page=${page}&source=legacy`
    : `vflix/${postId}/comments/${commentId}/replies?page=${page}`;
  const response = await apiGet<IGetVflixCommentResponse>(endpoint, token);
  return response;
};