interface IApiMessage {
  error?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

interface INewComment {
  comment: string;
  parent_id?: string;
}

type PrivacyType = "everyone" | "followers" | "private";

interface IFileUploadCompleteBodyPart {
  partNumber: string;
  eTag: string;
}

interface IFileUploadCompleteBody {
  filename: string;
  upload_id: string;
  parts: IFileUploadCompleteBodyPart[];
}

// interface INewPost {
//   media?: {
//     key: string;
//     mime_type: string;
//   }[]; // Optional
//   caption: string;
//   address?: string;
//   latitude?: Number;
//   longitude?: Number;
//   privacy: string;
// }

interface INewPost {
  posts: {
    media?: {
      key: string;
      mime_type: string;
    }[];
    caption: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    privacy: string;
  }[];
}

interface ICreatePostToReplyBody {
  posts: {
    media?: {
      key: string;
      mime_type: string;
    }[];
    caption: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    privacy: string;
    parent_post_id: string;
  }[];
}

interface IVerifyOtpBody {
  email: string;
  otp: string;
  type: "password" | "email";
}

interface IUser {
  uuid: string;
  name: string;
  username: string;
  email: string;
  registration_type: string;
  account_type: string;
  phone_number: string | null;
  profile_picture: string;
  cover_photo: string | null;
  gender: string | null;
  dob: string | null;
  country: string | null;
  city: string | null;
  profession: string | null;
  bio: string | null;
  timezone: string;
  verified_status: number;
  online: boolean;
  last_online: string | null;
  is_private: boolean;
  has_two_factor_auth: boolean;
  status: string;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  referrer: string | null;
  referral_code: string;
  referral_count: number;
  can_reset_password: boolean;
  followers: number;
  following: number;
  is_blocked: boolean;
  token: string;
  provider?: string;
  provider_id?: string;
  provider_token?: string;
}

interface IRegisterResponse extends IUser {}

type IRegistrationType = "google" | "password" | "apple" | "facebook";
interface ISignup {
  username: string;
  email: string;
  name: string;
  password?: string;
  registration_type: IRegistrationType;
  provider?: IRegistrationType;
  timezone?: string;
  provider_id?: string;
  device_id?: string;
  device?: string;
  referrer_code?: string;
  fcm_token?: string;
}

interface IFeaturedLivestream {
  uuid: string;
  title: string;
  start_date: string;
  start_time: string;
  users: Number;
  gifts: Number;
  duration: string;
  category_id: Number;
  livestream_room_id: string;
  livestream_room_stream_id: string;
  livestream_room_stream_url: string;
  status: string;
  privacy: string;
  comments_enabled: boolean;
  questions_enabled: boolean;
  gifting_enabled: boolean;
  cover: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  host: {
    uuid: string;
    name: string;
    username: string;
    email: string;
    verified_status: number;
    checkmark_verification_status: boolean;
    premium_verification_status: boolean;
    profile_picture: string;
    online: boolean;
  };
  category: {
    id: Number;
    name: string;
  };
}

interface IFeaturedLivestreamResponse
  extends IPaginatedResponse<IFeaturedLivestream> {}

interface INotifications {
  subject: {
    icon: string;
    name: string;
  };
  description: string;
  object: {
    title: string | null;
    thumbnail: string | null;
  };
  notification_type: string;
  service_type: string;
  service_id: string;
  date: string;
  time: string;
  time_ago: string;
}

interface INotificationsResponse extends IPaginatedResponse<INotifications> {}

interface IVflix {
  uuid: string;
  user_id: string;
  caption: string;
  parent_post_id: null;
  root_post_id: string;
  quote_post_id: null;
  thread_id: number;
  address: string;
  latitude: number;
  longitude: number;
  privacy: string;
  status: string;
  views_count: string;
  shares_count: string;
  likes_count: string;
  impressions: string;
  unique_views: string;
  clicks: number;
  engagements: number;
  additional_metadata: null;
  created_at: string;
  updated_at: string;
  user: IPostUser;
  media: IPostMedia;
  replies_count: string | undefined;
  comments_count: string | number;
  formatted_date: string;
  is_liked: boolean;
  is_followed: boolean;
  is_giftable: boolean;
}

interface IPostMedia {
  uuid: string;
  post_id: string;
  media_filename: string;
  media_url: string;
  transcoded_media_url: string | null;
  media_type: "image" | "video";
  media_size: string;
  media_thumbnail: string;
  is_transcode_complete: boolean;
  media_duration: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface IPostUser {
  uuid: string;
  name: string | null;
  username: string | null;
  email: string;
  verified_status: number;
  profile_picture: string | null;
  checkmark_verification_status: boolean;
  premium_verification_status: boolean;
  online: boolean;
}

interface IPost {
  uuid: string;
  user_id: string;
  caption: string;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  privacy: PrivacyType;
  status: "active" | "inactive";
  views_count: string;
  shares_count: string;
  likes_count: string;
  replies_count: string | number;
  additional_metadata: any;
  created_at: Date;
  updated_at: Date;
  user: IPostUser;
  media: IPostMedia[];
  formatted_time: string;
  is_saved: boolean;
  is_liked: boolean;
}

interface IPaginatedResponse<T> {
  current_page: string;
  data: T[];
  per_page: number;
  total: number;
  last_page: number;
}

interface IPostsResponse extends IPaginatedResponse<IPost> {}

interface IVFlixResponse extends IPaginatedResponse<IVflix> {}

interface ICommentsResponse extends IPaginatedResponse<IPostComment> {}

interface IPostComment {
  uuid: string;
  user_id: string;
  caption: string;
  parent_post_id: string;
  root_post_id: string;
  quote_post_id: null;
  thread_id: string;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  privacy: PrivacyType;
  status: "active" | "inactive";
  views_count: string;
  shares_count: string;
  likes_count: string;
  replies_count: string | number;
  impressions: string;
  additional_metadata: null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  user: IPostUser;
  media: IPostMedia[];
  formatted_time: string;
  is_saved: boolean;
  is_liked: boolean;
  is_thread_continuation: boolean;
}

interface IGetVflixComments {
  uuid: string;
  post_id: string;
  user_id: string;
  likes_count: string;
  comment: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  user: IPostUser;
  is_liked: boolean;
  formatted_time: string;
  reply_count: number;
}

interface IGetVflixCommentResponse extends IPaginatedResponse<IGetVflixComments> {}


interface INewPostResponse extends IPost {}

interface ILikeOrUnlikePostResponse {
  is_liked: boolean;
}

interface ILikeOrUnlikeVflixResponse {
  is_liked: boolean;
}

interface ISaveOrUnsavePostResponse {
  is_saved: boolean;
}

interface CommentWithReplies {
  loadedReplies: IPostComment[];
  hasMoreReplies: boolean;
  replyPage: number;
}

interface IFileUploadStartResponse {
  ServerSideEncryption: string;
  Bucket: string;
  Key: string;
  UploadId: string;
}

interface IFileUploadChunkResponse {
  partNumber: string;
  eTag: string;
}

interface IFileUploadCompleteResponse {
  ServerSideEncryption: string;
  Location: string;
  Bucket: string;
  Key: string;
  ETag: string;
}
