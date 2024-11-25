import { Button } from "components/ui/button";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Separator } from "components/ui/separator";
import SponsorCard from "../Reusable/SponsorCard";

const SocialMainWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row justify-between w-[800px] mx-auto h-full pt-4">
      <div className="flex w-[500px] rounded-lg pb-8">{children}</div>
      <div className="flex flex-col gap-8">
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
