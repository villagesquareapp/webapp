"use client";

import { VSSmallCoin } from "components/icons/village-square";
import { Button } from "components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

const DailyLoginReward = () => {
  const [isDailyLoginRewardOpen, setIsDailyLoginRewardOpen] = useState(false);

  let rewardCollected = true;

  return (
    <Dialog open={isDailyLoginRewardOpen} onOpenChange={setIsDailyLoginRewardOpen}>
      <DialogContent className="place-items-center w-80 h-[270px]">
        <DialogTitle className="sr-only">Daily Login Reward</DialogTitle>
        <div className="relative size-fit">
          <Image
            src="/images/village-square-coin.png"
            alt="Daily Login Reward"
            className="z-20"
            width={100}
            height={100}
          />
          {rewardCollected && (
            <>
              <div className="absolute size-[94px] z-10 top-7 left-[74px]">
                <Image
                  src="/images/confetti.png"
                  alt="Daily Login Reward"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute size-[94px] transform scale-x-[-1]  z-10 top-7 right-[74px]">
                <Image
                  src="/images/confetti.png"
                  alt="Daily Login Reward"
                  fill
                  className="object-contain"
                />
              </div>
            </>
          )}
        </div>
        {!rewardCollected && (
          <div className="flex flex-col gap-y-2  w-full place-items-center">
            <p className="text-sm">Daily Login Reward</p>
            <div className="flex items-center gap-x-0.5">
              <VSSmallCoin className="w-20 h-4 -mr-3 -mt-1" />
              <p className="text-sm text-yellow-600">10 Coins</p>
            </div>
            <Button className="w-full text-foreground">Collect Reward</Button>
          </div>
        )}
        {rewardCollected && (
          <div className="flex flex-col gap-y-2  w-full place-items-center">
            <p className="text-sm">Reward Collected</p>
            <Button className="w-full text-foreground">Okay</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DailyLoginReward;
