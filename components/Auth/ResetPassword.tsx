"use client";

import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { Input } from "components/ui/input";
import * as React from "react";
import { ImSpinner8 } from "react-icons/im";
import Link from "next/link";

interface ResetPasswordProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResetPassword({ className, ...props }: ResetPasswordProps) {
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
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          You can now proceed to set a new password for your account.{" "}
        </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Input id="password" placeholder="Password" type="password" />
            </div>
            <Button disabled={isLoading}>
              {isLoading && <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP
            </Button>
          </div>
        </form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Go back to{" "}
          <Link href="/auth/login" className="hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
