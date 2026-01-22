// import { useEffect, useState, useRef } from "react";
// import CustomAvatar from "components/ui/custom/custom-avatar";
// import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
// import { Separator } from "components/ui/separator";
// import Image from "next/image";
// import { FaBell } from "react-icons/fa";
// import { IoIosClose } from "react-icons/io";
// import { getNotifications, readAllNotifications } from "api/notification";
// import { useParams } from "next/navigation";

// const Notification = () => {
//   const [open, setOpen] = useState(false);
//   const [page, setPage] = useState<number>(1);
//   const [notifications, setNotifications] = useState<INotifications[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const observerTarget = useRef<HTMLDivElement>(null);

//   // Handle popover open
//   useEffect(() => {
//     if (open) {
//       readAllNotifications().catch((error) => {
//         console.error("Error marking notifications as read:", error);
//       });
//     }
//   }, [open]);

//   const fetchNotifications = async (pageNumber: number) => {
//     try {
//       setIsLoading(true);
//       const response = await getNotifications(pageNumber);

//       if (response?.status && response?.data?.data) {
//         const newNotifications = response.data.data;

//         setNotifications((prev) =>
//           pageNumber === 1 ? newNotifications : [...prev, ...newNotifications]
//         );

//         // Check if we have more notifications to load
//         const totalNotifications = response.data.total || 0;
//         const currentTotal = (pageNumber - 1) * 15 + newNotifications.length;
//         setHasMore(currentTotal < totalNotifications);
//       }
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     fetchNotifications(1);
//   }, []);

//   // Set up intersection observer for infinite scroll
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !isLoading) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       },
//       {
//         root: null,
//         rootMargin: "100px",
//         threshold: 0.1,
//       }
//     );

//     const currentTarget = observerTarget.current;
//     if (currentTarget) {
//       observer.observe(currentTarget);
//     }

//     return () => {
//       if (currentTarget) {
//         observer.unobserve(currentTarget);
//       }
//     };
//   }, [hasMore, isLoading]);

//   // Fetch when page changes
//   useEffect(() => {
//     if (page > 1) {
//       fetchNotifications(page);
//     }
//   }, [page]);

//   const notificationsCount = notifications.length;

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger>
//         <div className="relative">
//           <div className="bg-red-500 text-xs h-6 w-6 absolute -top-1 right-0 rounded-full flex items-center justify-center text-foreground">
//             {notificationsCount}
//           </div>
//           <FaBell className="text-foreground size-8" />
//         </div>
//       </PopoverTrigger>
//       <PopoverContent
//         className="w-[380px] rounded-xl p-0"
//         side="left"
//         align="start"
//         sideOffset={10}
//       >
//         {/* Fixed header */}
//         <div className="px-4 py-2 flex items-center justify-between sticky top-0 bg-background rounded-t-xl">
//           <p className="font-semibold">Notifications</p>
//           <IoIosClose
//             className="size-8 cursor-pointer hover:text-muted-foreground"
//             onClick={() => setOpen(false)}
//           />
//         </div>
//         <Separator className="w-full" />

//         {/* Scrollable content */}
//         <div className="max-h-[400px] overflow-y-auto">
//           {/* Today's notifications */}

//           <div className="px-4 py-2">
//             <p className="text-sm font-medium">Today</p>
//           </div>
//           {notifications?.map((notification, index) => (
//             <div key={index}>
//               <div className="flex flex-col gap-y-2">
//                 {/* Notification item */}
//                 <div className="px-4 py-2 hover:bg-muted/50">
//                   <div className="flex flex-row items-center gap-x-3">
//                     {notification?.subject?.icon && (
//                       <CustomAvatar
//                         src={notification?.subject?.icon}
//                         name="CN"
//                         className="size-9"
//                       />
//                     )}
//                     <div className="flex-1">
//                       <div className="text-sm">
//                         <span className="font-medium">{notification.subject.name} </span>
//                         <span className="text-muted-foreground">
//                           {notification?.description}
//                         </span>
//                       </div>
//                       <span className="text-xs text-muted-foreground">
//                         {notification?.time_ago} ago
//                       </span>
//                     </div>
//                     <div className="size-12 relative rounded-md overflow-hidden">
//                       {notification?.object?.thumbnail && (
//                         <Image
//                           src={notification?.object?.thumbnail}
//                           alt="beautiful-image"
//                           fill
//                           className="object-cover"
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <Separator className="w-full" />

//                 {/* Yesterday's notifications */}
//                 {/* <div className="px-4 py-2">
//               <p className="text-sm font-medium text-muted-foreground">Yesterday</p>
//             </div>
//             <div className="px-4 py-1 hover:bg-muted/50">
//               <div className="flex flex-row items-center gap-x-3">
//                 <CustomAvatar
//                   src={"/images/beautiful-image.webp"}
//                   name="CN"
//                   className="size-9"
//                 />
//                 <div className="flex-1">
//                   <div className="text-sm">
//                     <span className="font-medium">Jane Smith </span>
//                     <span className="text-muted-foreground">liked your post</span>
//                   </div>
//                   <span className="text-xs text-muted-foreground">1d ago</span>
//                 </div>
//                 <div className="size-12 relative rounded-md overflow-hidden">
//                   <Image
//                     src={"/images/beautiful-image.webp"}
//                     alt="beautiful-image"
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//               </div>
//             </div>
//             <Separator className="w-full" /> */}
//               </div>
//             </div>
//           ))}
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default Notification;


"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Separator } from "components/ui/separator";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { getNotifications, readAllNotifications } from "api/notification";

const Notification = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Mark notifications as read when opened
  useEffect(() => {
    if (open) {
      readAllNotifications().catch((error) => {
        console.error("Error marking notifications as read:", error);
      });
    }
  }, [open]);

  const fetchNotifications = async (pageNumber: number) => {
    try {
      setIsLoading(true);
      const response = await getNotifications(pageNumber);

      if (response?.status && response?.data?.data) {
        const newNotifications = response.data.data;

        setNotifications((prev) =>
          pageNumber === 1 ? newNotifications : [...prev, ...newNotifications]
        );

        const totalNotifications = response.data.total || 0;
        const currentTotal = (pageNumber - 1) * 15 + newNotifications.length;
        setHasMore(currentTotal < totalNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications(1);
  }, []);

  // Infinite scroll setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, isLoading]);

  // Fetch when page changes
  useEffect(() => {
    if (page > 1) fetchNotifications(page);
  }, [page]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, INotifications[]> = {};

    notifications
      .filter(
        (n) =>
          n.subject?.name ||
          n.description ||
          n.object?.title ||
          n.notification_type
      ) // Skip empty ones
      .forEach((notif) => {
        const dateKey = notif.date || "Unknown Date";
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(notif);
      });

    return groups;
  }, [notifications]);

  const notificationsCount = notifications.length;

  const formatDateLabel = (date: string) => {
    if (!date) return "";
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const notifDate = new Date(date).toDateString();

    if (notifDate === today) return "Today";
    if (notifDate === yesterday) return "Yesterday";
    return date;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="relative">
          {notificationsCount > 0 && (
            <div className="bg-red-500 text-xs h-5 w-5 absolute -top-1 right-0 rounded-full flex items-center justify-center text-white">
              {notificationsCount}
            </div>
          )}
          <FaBell className="text-foreground size-7 cursor-pointer" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-screen max-w-[380px] md:w-[380px] rounded-xl p-0 shadow-xl mx-2 md:mx-0"
        side="bottom"
        align="end"
        sideOffset={10}
      >
        {/* Header */}
        <div className="px-4 py-2 flex items-center justify-between sticky top-0 bg-background rounded-t-xl border-b">
          <p className="font-semibold">Notifications</p>
          <IoIosClose
            className="size-6 cursor-pointer hover:text-muted-foreground"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[420px] overflow-y-auto">
          {Object.entries(groupedNotifications).map(([date, notifs]) => (
            <div key={date}>
              {/* Date heading */}
              <div className="px-4 py-2 bg-muted/10">
                <p className="text-sm font-medium text-muted-foreground">
                  {formatDateLabel(date)}
                </p>
              </div>

              {/* Notification items */}
              {notifs.map((notification, index) => (
                <div key={index}>
                  <div className="px-4 py-2 hover:bg-muted/50 transition">
                    <div className="flex flex-row items-center gap-x-3">
                      {notification.subject?.icon ? (
                        <CustomAvatar
                          src={notification.subject.icon}
                          name={notification.subject.name}
                          className="size-9"
                        />
                      ) : (
                        <CustomAvatar
                          src="https://cdn-assets.villagesquare.io/profile_pictures/default_user.png"
                          name={notification.subject?.name || "?"}
                          className="size-9"
                        />
                      )}

                      <div className="flex-1">
                        <div className="text-sm leading-tight">
                          {notification.subject?.name && (
                            <span className="font-medium">
                              {notification.subject.name}{" "}
                            </span>
                          )}
                          {notification.notification_type === 'post_reply' ? <span className="text-muted-foreground">
                            {notification.description || "There's a reply on your post."}
                          </span> : <span className="text-muted-foreground">
                            {notification.description}
                          </span>}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {notification.time_ago} ago
                        </span>
                      </div>

                      {notification.object?.thumbnail && (
                        <div className="size-12 relative rounded-md overflow-hidden">
                          <Image
                            src={notification.object.thumbnail}
                            alt="notification thumbnail"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator className="w-full" />
                </div>
              ))}
            </div>
          ))}

          {/* Empty state */}
          {!notifications.length && !isLoading && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications yet 🎉
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={observerTarget}></div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="py-3 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
