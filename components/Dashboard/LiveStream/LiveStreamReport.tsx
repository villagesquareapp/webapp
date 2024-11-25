import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import Image from "next/image";
import { MdOutlinedFlag } from "react-icons/md";
import LiveStreamDialog from "./LiveStreamDialog";

const LiveStreamReport = () => {
  let reportSent = true;

  // @Todo Are you sure you want to join session?

  return (
    <LiveStreamDialog
      contentClassName={`${reportSent ? "w-[420px] h-[420px]" : "max-w-[650px]"}
      }`}
      trigger={
        <Button variant="outline" className="flex items-center gap-x-1 w-28 rounded-full">
          <MdOutlinedFlag className="size-4" />
          Report
        </Button>
      }
      title={!reportSent ? "Report Live Stream" : ""}
      footer={
        !reportSent ? (
          <Button className="text-foreground" size={"lg"}>
            Send Report
          </Button>
        ) : (
          <span className="font-semibold text-center -mb-3">Okay</span>
        )
      }
    >
      <div className={` h-full overflow-y-hidden`}>
        {reportSent && (
          <div className="flex flex-col gap-y-4 place-items-center text-center">
            <Image
              src={"/images/successful-check.png"}
              alt="question-and-answer"
              width={150}
              height={150}
            />
            <p className="text-center font-semibold">Report Sent Successfully!</p>
            <p>Your report regarding this live stream has been submitted successfully.</p>
          </div>
        )}

        {!reportSent && (
          <form
            onSubmit={() => console.log("Submitted")}
            className="h-full w-full flex flex-col gap-y-4"
          >
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="reason" className="font-semibold">
                Reason To Report
              </Label>
              <Select>
                <SelectTrigger className="w-full !border-none !outline-none bg-accent !ring-0">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="racist_word">Racist Word</SelectItem>
                    <SelectItem value="spamming">Spamming</SelectItem>
                    <SelectItem value="scam">Scam</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-y-1 h-full">
              <Label htmlFor="concern" className="font-semibold">
                Tell Us Your Concern
              </Label>
              <textarea
                placeholder="Write..."
                className="h-full !outline-none !border-none !ring-0 w-full p-4 resize-none rounded-xl bg-accent"
              />
            </div>
          </form>
        )}
      </div>
    </LiveStreamDialog>
  );
};

export default LiveStreamReport;
