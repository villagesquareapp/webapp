import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Separator } from "components/ui/separator";
import SponsorCard from "../Reusable/SponsorCard";
import { useEffect, useRef, useState } from "react";

const SocialMainWrapper = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rightPosition, setRightPosition] = useState<number | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rightEdge = window.innerWidth - containerRect.right;
        setRightPosition(rightEdge);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-row justify-between w-[800px] mx-auto h-full pt-4 relative"
    >
      <div className="flex w-[500px] rounded-lg pb-8">{children}</div>
      <div
        className="flex flex-col gap-8 h-fit"
        style={{
          position: "fixed",
          top: "5rem" /* Adjusted to account for navbar height */,
          right: rightPosition ? `${rightPosition}px` : "auto",
          width: "280px",
        }}
      >
        <SponsorCard sponsorType="social" />
        <div className="w-full gap-y-3 h-fit border rounded-xl flex flex-col">
          <p className="px-3 pt-4 pb-2 font-semibold">People Suggestions</p>
          <Separator />
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index}>
              <div className="flex items-center flex-row px-3 justify-between">
                <div className="flex items-center gap-x-3 w-40">
                  <CustomAvatar
                    src="https://github.com/shadcn.png"
                    name="CN"
                    className="size-12 border-foreground border-2 "
                  />
                  <p className="truncate text-sm">John Doe</p>
                </div>
                <Button className="text-foreground">Follow</Button>
              </div>
              <Separator className="my-3" />
            </div>
          ))}
          <Button
            className="text-center mx-auto -mt-2 mb-2 text-muted-foreground"
            variant={"ghost"}
          >
            View More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialMainWrapper;
