import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Separator } from "components/ui/separator";
import { cn } from "lib/utils";
import { HTMLAttributes, useState } from "react";
import { IoClose } from "react-icons/io5";

const LiveStreamDialog = ({
  title,
  footer,
  children,
  trigger,
  contentClassName,
  leftAndRightButton,
  removeFooterBorder = false,
}: {
  removeFooterBorder?: boolean;
  title?: string | null;
  footer?: React.ReactNode | null;
  leftAndRightButton?: React.ReactNode | null;
  children: React.ReactNode;
  trigger: React.ReactNode;
  contentClassName?: HTMLAttributes<HTMLDivElement>["className"];
}) => {
  const [openLiveStreamDialog, setOpenLiveStreamDialog] = useState(false);

  return (
    <Dialog open={openLiveStreamDialog} onOpenChange={setOpenLiveStreamDialog}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          `max-w-[650px] h-[70dvh] !max-h-[90dvh] rounded-xl overflow-hidden flex flex-col
            ${title ? "p-0" : "pt-10 px-0"}
            `,
          contentClassName
        )}
      >
        {!title && <DialogTitle className="sr-only">Live Stream</DialogTitle>}
        {title && (
          <DialogHeader className="sticky top-0 bg-background border-b z-50">
            {title && (
              <div className="flex items-center justify-between px-6 py-3">
                <DialogTitle className="text-center flex-1">{title}</DialogTitle>
                <Button
                  variant="ghost"
                  className="p-1 px-2.5 rounded-full transition-colors"
                  onClick={() => setOpenLiveStreamDialog(false)}
                >
                  <IoClose className="size-6" />
                </Button>
              </div>
            )}
          </DialogHeader>
        )}

        <div className="flex-1 overflow-y-auto px-6">{children}</div>
        {footer && (
          <div className="sticky inset-x-0 w-full bottom-0 bg-background h-fit">
            <div
              className={`${
                !removeFooterBorder && "border-t"
              } py-4 px-6 flex flex-col gap-y-4`}
            >
              {footer}
            </div>
          </div>
        )}
        {leftAndRightButton && (
          <div className="sticky inset-x-0 w-full bottom-0 bg-background h-fit">
            <div className="border-t items-center px-6 flex flex-row justify-evenly relative">
              <span className="py-3 text-sm text-muted-foreground">Cancel</span>
              <Separator
                orientation="vertical"
                className="absolute left-1/2 h-full -translate-x-1/2"
              />
              {leftAndRightButton}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LiveStreamDialog;
