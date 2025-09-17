import { useEffect, useState, useRef } from "react";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Separator } from "components/ui/separator";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { getNotifications, readAllNotifications } from "api/notification";
import { useParams } from "next/navigation";

const Notification = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Handle popover open
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

        // Check if we have more notifications to load
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

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading]);

  // Fetch when page changes
  useEffect(() => {
    if (page > 1) {
      fetchNotifications(page);
    }
  }, [page]);

  const notificationsCount = notifications.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="relative">
          <div className="bg-red-500 text-xs h-6 w-6 absolute -top-1 right-0 rounded-full flex items-center justify-center text-foreground">
            {notificationsCount}
          </div>
          <FaBell className="text-foreground size-8" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[380px] rounded-xl p-0"
        side="left"
        align="start"
        sideOffset={10}
      >
        {/* Fixed header */}
        <div className="px-4 py-2 flex items-center justify-between sticky top-0 bg-background rounded-t-xl">
          <p className="font-semibold">Notifications</p>
          <IoIosClose
            className="size-8 cursor-pointer hover:text-muted-foreground"
            onClick={() => setOpen(false)}
          />
        </div>
        <Separator className="w-full" />

        {/* Scrollable content */}
        <div className="max-h-[400px] overflow-y-auto">
          {/* Today's notifications */}

          <div className="px-4 py-2">
            <p className="text-sm font-medium">Today</p>
          </div>
          {notifications?.map((notification, index) => (
            <div key={index}>
              <div className="flex flex-col gap-y-2">
                {/* Notification item */}
                <div className="px-4 py-2 hover:bg-muted/50">
                  <div className="flex flex-row items-center gap-x-3">
                    {notification?.subject?.icon && (
                      <CustomAvatar
                        src={notification?.subject?.icon}
                        name="CN"
                        className="size-9"
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-medium">{notification.subject.name} </span>
                        <span className="text-muted-foreground">
                          {notification?.description}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {notification?.time_ago} ago
                      </span>
                    </div>
                    <div className="size-12 relative rounded-md overflow-hidden">
                      {notification?.object?.thumbnail && (
                        <Image
                          src={notification?.object?.thumbnail}
                          alt="beautiful-image"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <Separator className="w-full" />

                {/* Yesterday's notifications */}
                {/* <div className="px-4 py-2">
              <p className="text-sm font-medium text-muted-foreground">Yesterday</p>
            </div>
            <div className="px-4 py-1 hover:bg-muted/50">
              <div className="flex flex-row items-center gap-x-3">
                <CustomAvatar
                  src={"/images/beautiful-image.webp"}
                  name="CN"
                  className="size-9"
                />
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium">Jane Smith </span>
                    <span className="text-muted-foreground">liked your post</span>
                  </div>
                  <span className="text-xs text-muted-foreground">1d ago</span>
                </div>
                <div className="size-12 relative rounded-md overflow-hidden">
                  <Image
                    src={"/images/beautiful-image.webp"}
                    alt="beautiful-image"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <Separator className="w-full" /> */}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
