"use server";

import { apiGet, apiPost } from "lib/api";
import { getToken } from "lib/getToken";

export const getFeaturedLivestreams = async (
  limit: number,
  page: number = 1
) => {
  const token = await getToken();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await apiGet<IFeaturedLivestreamResponse>(
    `livestreams/explore/featured?${params.toString()}`,
    token
  );
  return response;
};

export const createLivestream = async (formData: FormData) => {
  const token = await getToken();
  return await apiPost<IStartLivestreamData>(
    `/livestreams/start`,
    formData,
    token
  );
};

export const getLivestreamDetails = async (uuid: string) => {
  const token = await getToken();
  const response = await apiGet<ILivestreamDetails>(
    `livestreams/${uuid}`,
    token
  );
  return response;
};

export const endLivestream = async (uuid: string) => {
  const token = await getToken();
  const response = await apiGet<IEndLivestream>(
    `livestreams/${uuid}/end-livestream`,
    token
  );
  return response;
};

export const saveStreamToPosts = async (roomId: string) => {
  const token = await getToken();
  const response = await apiGet(`livestreams/${roomId}/save-livestream`, token);

  return response;
};

export const getLivestreamQuestions = async (uuid: string) => {
  const token = await getToken();
  const response = await apiGet<ILivestreamQuestion[]>(
    `livestreams/${uuid}/questions`,
    token
  );
  return response;
}