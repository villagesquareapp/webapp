"use client";

import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import * as React from "react";
import { ImSpinner8 } from "react-icons/im";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

interface AccountVerificationProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AccountVerification({ className, ...props }: AccountVerificationProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Account Verification</h1>
        <p className="text-sm text-muted-foreground font-semibold">
          6-digit OTP code has been issued and sent to the provided email address. <br />
          <span className="font-semibold text-[#0AF5F3]">michaeljor@gmail.com</span>
        </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-1">
              <InputOTP maxLength={6}>
                <InputOTPGroup className="w-full justify-between">
                  <InputOTPSlot index={0} className="rounded-md" />
                  <InputOTPSlot index={1} className="rounded-md" />
                  <InputOTPSlot index={2} className="rounded-md" />
                  <InputOTPSlot index={3} className="rounded-md" />
                  <InputOTPSlot index={4} className="rounded-md" />
                  <InputOTPSlot index={5} className="rounded-md" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button disabled={isLoading} className="text-foreground">
              {isLoading && <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm OTP
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
