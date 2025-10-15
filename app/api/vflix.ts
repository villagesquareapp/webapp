'use server';

import { apiGet, apiPost } from "lib/api";
import { getToken } from "lib/getToken";

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

export async function likeOrUnlikeVflix(postId: string, formData: FormData) {
    const token = await getToken();
    return await apiPost<ILikeOrUnlikeVflixResponse>(`/posts/vflix/${postId}/like`, {
        body: formData,
        isFormData: true
    }, token)
};

export const getVflixComments = async (postId: string, page: number = 1) => {
  const token = await getToken();
  const response = await apiGet<IGetVflixCommentResponse>(
    `posts/vflix/${postId}/comments?page=${page}`,
    token
  );
  return response;
};

export const createVflixComment = async (
  postId: string,
  newCommentData: INewVflixComment
) => {
  const token = await getToken();
  const response = await apiPost<INewVflixCommentResponse>(
    `posts/vflix/${postId}/comments/add`,
    newCommentData,
    token
  );
  return response;
};

export const likeOrUnlikeVflixComment = async (
  postId: string,
  uuid: string,
  formData: FormData
) => {
  const token = await getToken();
  const response = await apiPost<ILikeOrUnlikeVflixCommentResponse>(
    `posts/vflix/${postId}/comments/${uuid}/like`,
    {
      body: formData,
      isFormData: true,
    },
    token
  );
  return response;
};

// export const getVflixReplies = async (commentId: string, page: number = 1) => {
//   const token = await getToken();
//   const response = await apiGet<IGetVflixRepliesResponse>(
//     `posts/vflix/comments/${commentId}/replies?page=${page}`,
//     token
//   );
//   return response;
// };