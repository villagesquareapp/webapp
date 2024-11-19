"use client";

import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import * as React from "react";
import { ImSpinner8 } from "react-icons/im";
import { Input } from "../ui/input";

interface ForgotPasswordProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPassword({ className, ...props }: ForgotPasswordProps) {
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
        <h1 className="text-2xl font-semibold tracking-tight">Forgot Password?</h1>
        <p className="text-sm text-muted-foreground font-semibold">
          Reset your password effortlessly by requesting an email confirmation.
        </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Input id="email" placeholder="Email" type="email" autoCapitalize="none" />
            </div>
            <Button disabled={isLoading}>
              {isLoading && <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
