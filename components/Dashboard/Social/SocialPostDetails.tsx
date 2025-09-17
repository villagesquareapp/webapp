import { Separator } from "components/ui/separator";
import Image from "next/image";
import PostHeader from "./PostHeader";
import PostText from "./PostText";
import PostVideo from "./PostVideo";
import SocialPostActionButtons from "./SocialPostActionButtons";
import { useState } from "react";
import PostDetails from "./PostDetails";
import { ArrowLeft } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "components/ui/carousel";

const SocialPostDetails = ({
  post,
  setPosts,
  user,
  likeUnlikePost,
  saveUnsavePost,
  currentVideoPlaying,
  setCurrentVideoPlaying,
  isPlayingVideo,
  setIsPlayingVideo,
}: {
  post: IPost;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  user: IUser;
  likeUnlikePost: (postId: string) => void;
  saveUnsavePost: (postId: string) => void;
  currentVideoPlaying: string;
  setCurrentVideoPlaying: (mediaID: string) => void;
  isPlayingVideo: boolean;
  setIsPlayingVideo: (playing: boolean) => void;
}) => {
  const [isGloballyMuted, setIsGloballyMuted] = useState(true);
  const [activeMediaCarouselIndex, setActiveMediaCarouselIndex] = useState(0);

  return (
    <div className="flex flex-col gap-y-4">
      <PostHeader post={post} />

      <div className="flex flex-col gap-y-4">
        {!!post?.media?.length && (
          <div className="p-4 w-full">
            <Carousel
              // onSelect={(api) => {
              //   if (api && typeof api.selectedScrollSnap === "function") {
              //     setActiveMediaCarouselIndex(api.selectedScrollSnap());
              //   }
              // }}
            >
              <CarouselContent>
                {post.media.map((media, index) => (
                  <CarouselItem key={`${media.uuid}-${index}`}>
                    {media.media_type === "image" ? (
                      <div className="relative w-full aspect-[4/5] max-h-[500px] rounded-xl overflow-hidden">
                        <Image
                          src={media.media_url}
                          alt="post"
                          fill
                          className="object-cover"
                          sizes="100vw"
                          quality={90}
                        />
                      </div>
                    ) : (
                      <PostVideo
                        media={media}
                        currentVideoPlaying={currentVideoPlaying}
                        setCurrentVideoPlaying={setCurrentVideoPlaying}
                        src={media.media_url}
                        // showEchoButtons={false}
                        // This logic ensures only the active carousel video can play
                        isPlayingVideo={
                          activeMediaCarouselIndex === index && isPlayingVideo
                        }
                        setIsPlayingVideo={setIsPlayingVideo}
                        className="aspect-[4/5] max-h-[500px]"
                        isGloballyMuted={isGloballyMuted}
                        setGlobalMuteState={setIsGloballyMuted}
                      />
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Only show navigation buttons for multiple media items */}
              {post.media.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>
        )}
        {/* Post text with highlighted hashtags */}
        <PostText text={post?.caption} />
      </div>
      {/* <SocialPostActionButtons
        setPosts={setPosts}
        likeUnlikePost={likeUnlikePost}
        saveUnsavePost={saveUnsavePost}
        post={post}
        user={user}
      /> */}
      <Separator className="my-2" />
    </div>
  );
};

export default SocialPostDetails;

// import { Separator } from "components/ui/separator";
// import Image from "next/image";
// import PostHeader from "./PostHeader";
// import PostText from "./PostText";
// import PostVideo from "./PostVideo";
// import SocialPostActionButtons from "./SocialPostActionButtons";
// import { useState } from "react";
// import PostDetails from "./PostDetails";
// import { ArrowLeft } from "lucide-react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "components/ui/carousel";

// const SocialPostDetails = ({
//   post,
//   setPosts,
//   user,
//   likeUnlikePost,
//   saveUnsavePost,
//   currentVideoPlaying,
//   setCurrentVideoPlaying,
//   isPlayingVideo,
//   setIsPlayingVideo,
// }: {
//   post: IPost;
//   setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
//   user: IUser;
//   likeUnlikePost: (postId: string) => void;
//   saveUnsavePost: (postId: string) => void;
//   currentVideoPlaying: string;
//   setCurrentVideoPlaying: (mediaID: string) => void;
//   isPlayingVideo: boolean;
//   setIsPlayingVideo: (playing: boolean) => void;
// }) => {
//   const [showPostDetails, setShowPostDetails] = useState(false);
//   const [clickedMediaIndex, setClickedMediaIndex] = useState(0);

//   const [isGloballyMuted, setIsGloballyMuted] = useState(true);

//   const handlePostClickWithVideoPause = (
//     e: React.MouseEvent,
//     mediaIndex?: number
//   ) => {
//     e.stopPropagation();

//     // If a video is playing, pause it before opening the details
//     if (isPlayingVideo) {
//       // Small delay to ensure we don't create race conditions
//       setTimeout(() => {
//         setIsPlayingVideo(false);
//         setCurrentVideoPlaying("");
//         // Open details after ensuring video is paused
//         setClickedMediaIndex(mediaIndex ?? 0);
//         setShowPostDetails(true);
//       }, 150);
//     } else {
//       // No video playing, just open details immediately
//       setClickedMediaIndex(mediaIndex ?? 0);
//       setShowPostDetails(true);
//     }
//   };

//   // Determine if this is a single media post
//   const isSingleMedia = post?.media?.length === 1;

//   return (
//     <div className="flex flex-col gap-y-4">
//       <PostHeader post={post} />

//       <div
//         className="flex flex-col gap-y-4 cursor-pointer"
//         onClick={(e) => handlePostClickWithVideoPause(e)}
//       >
//         {!!post?.media?.length && (
//           <div className="p-4 w-full">
//             {post.media.length > 1 ? (
//               <Carousel className="w-full max-w-2xl mx-auto">
//                 <CarouselContent>
//                   {post.media.map((media, index) => (
//                     <CarouselItem key={`${media.uuid}-${index}`}>
//                       {media.media_type === "image" ? (
//                         <div className="relative w-full aspect-[4/5] max-h-[500px] rounded-xl overflow-hidden">
//                           <Image
//                             src={media.media_url}
//                             alt="post"
//                             fill
//                             className="object-cover"
//                             sizes="100vw"
//                             quality={90}
//                           />
//                         </div>
//                       ) : (
//                         <PostVideo
//                           media={media}
//                           currentVideoPlaying={currentVideoPlaying}
//                           setCurrentVideoPlaying={setCurrentVideoPlaying}
//                           src={media.media_url}
//                           showEchoButtons={false}
//                           isPlayingVideo={isPlayingVideo}
//                           setIsPlayingVideo={setIsPlayingVideo}
//                           className="aspect-[4/5] max-h-[500px]"
//                           isGloballyMuted={isGloballyMuted}
//                           setGlobalMuteState={setIsGloballyMuted}
//                         />
//                       )}
//                     </CarouselItem>
//                   ))}
//                 </CarouselContent>
//                 <CarouselPrevious />
//                 <CarouselNext />
//               </Carousel>
//             ) : (
//               <>
//                 {post.media[0].media_type === "image" ? (
//                   <div className="relative w-full aspect-[4/5] max-h-[500px] rounded-xl overflow-hidden">
//                     <Image
//                       src={post.media[0].media_url}
//                       alt="post"
//                       fill
//                       className="object-cover"
//                       sizes="100vw"
//                       quality={90}
//                     />
//                   </div>
//                 ) : (
//                   <PostVideo
//                     media={post.media[0]}
//                     currentVideoPlaying={currentVideoPlaying}
//                     setCurrentVideoPlaying={setCurrentVideoPlaying}
//                     src={post.media[0].media_url}
//                     showEchoButtons={false}
//                     isPlayingVideo={isPlayingVideo}
//                     setIsPlayingVideo={setIsPlayingVideo}
//                     className="aspect-[4/5] max-h-[500px]"
//                     isGloballyMuted={isGloballyMuted}
//                     setGlobalMuteState={setIsGloballyMuted}
//                   />
//                 )}
//               </>
//             )}
//           </div>
//         )}
//         {/* Post text with highlighted hashtags */}
//         <div
//           onClick={(e) => handlePostClickWithVideoPause(e)}
//           className="cursor-pointer"
//         >
//           <PostText text={post?.caption} />
//         </div>
//       </div>
//       <SocialPostActionButtons
//         setPosts={setPosts}
//         likeUnlikePost={likeUnlikePost}
//         saveUnsavePost={saveUnsavePost}
//         post={post}
//       />
//       <Separator className="my-2" />
//     </div>
//   );
// };

// export default SocialPostDetails;
