"use client";

import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import * as React from "react";
import { ImSpinner8 } from "react-icons/im";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { IoIosArrowBack } from "react-icons/io";
import AuthBackButton from "./AuthBackButton";

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
      <AuthBackButton />
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Account Verification</h1>
        <p>
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
                  <InputOTPSlot
                    index={0}
                    className="rounded-md size-12 bg-accent no_input_border"
                  />
                  <InputOTPSlot
                    index={1}
                    className="rounded-md size-12 bg-accent no_input_border"
                  />
                  <InputOTPSlot
                    index={2}
                    className="rounded-md size-12 bg-accent no_input_border"
                  />
                  <InputOTPSlot
                    index={3}
                    className="rounded-md size-12 bg-accent no_input_border"
                  />
                  <InputOTPSlot
                    index={4}
                    className="rounded-md size-12 bg-accent no_input_border"
                  />
                  <InputOTPSlot
                    index={5}
                    className="rounded-md size-12 bg-accent no_input_border"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button size={"lg"} className="auth_button" disabled={isLoading}>
              {isLoading && <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm OTP
            </Button>
          </div>
        </form>
        <p className="px-8 text-center text-sm">If you have not received OTP check “Spams”</p>
        <span className="text-[#0AF5F3] text-center font-semibold">Send Again</span>
      </div>
    </>
  );
}
