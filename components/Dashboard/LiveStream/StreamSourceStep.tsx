import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "components/ui/select";

interface StreamSourceStepProps {
  streamSource: string | null;
  setStreamSource: (value: string) => void;
}

const StreamSourceStep = ({ streamSource, setStreamSource }: StreamSourceStepProps) => (
  <div className="h-full overflow-y-auto">
    <form className="h-full w-full flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="stream-source" className="font-semibold">
          Stream Source
        </Label>
        <Select value={streamSource || ""} onValueChange={setStreamSource}>
          <SelectTrigger className="w-full !border-none !outline-none bg-accent !ring-0">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Stream Source</SelectLabel>
              <SelectItem value="webcam">Webcam</SelectItem>
              <SelectItem value="obs">OBS / RTMP</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {/* OBS/RTMP Inputs */}
      {streamSource === "obs" && (
        <>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="server" className="font-semibold">
              Server URL
            </Label>
            {/* The actual server URL for RTMP Ingestion (e.g., rtmp://yourserver.com/live) */}
            <Input id="server" className="bg-accent no_input_border" placeholder="rtmp://..." />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="stream-key" className="font-semibold">
              Stream Key
            </Label>
            {/* The unique key for the stream */}
            <Input
              id="stream-key"
              className="bg-accent no_input_border"
              placeholder="e.g., a1b2c3d4e5f6g7h8"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use the **Server URL** and **Stream Key** in your OBS settings to connect to the Villagesquare platform.
          </p>
        </>
      )}

    </form>
  </div>
);

export default StreamSourceStep;