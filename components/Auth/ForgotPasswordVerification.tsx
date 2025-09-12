"use client";

import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import * as React from "react";
import { ImSpinner8 } from "react-icons/im";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { IoIosArrowBack } from "react-icons/io";
import AuthBackButton from "./AuthBackButton";
import { verifyEmail, verifyOtp } from "api/auth";
import { toast } from "sonner";
import { ApiResponse } from "lib/api/base";
import { messageHandler } from "lib/messageHandler";
import { useRouter } from "next/navigation";

interface AccountVerificationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  email: string;
  username: string;
  extraFunction?: () => Promise<ApiResponse<IUser>>;
  goBack?: () => void;
}

export function ForgotPasswordVerification({
  className,
  email,
  username,
  extraFunction,
  goBack,
  ...props
}: AccountVerificationProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [otp, setOtp] = React.useState<string>("");
  const [isOtpRequestLoading, setIsOtpRequestLoading] =
    React.useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // First verify the OTP
      const otpVerificationResponse = await verifyOtp({
        email: email,
        otp: otp,
        type: "password",
      });

      if (!otpVerificationResponse?.status) {
        toast.error(
          otpVerificationResponse?.message || "OTP verification failed"
        );
        setIsLoading(false);
        return;
      } else {
        // If everything is successful
        toast.success("Verification successful!");
        setIsLoading(false);
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("An error occurred during verification");
      setIsLoading(false);
    }
  }

  async function resendOtp() {
    setIsOtpRequestLoading(true);

    try {
      const result = await verifyEmail({ email: email, username: username });

      if (!!result?.status) {
        setIsOtpRequestLoading(false);
        toast.success("OTP sent successfully");
      } else {
        toast.error(messageHandler(result?.message));
        setIsOtpRequestLoading(false);
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err instanceof Error ? err.message : "Registration failed");
      setIsOtpRequestLoading(false);
    }
  }

  return (
    <>
      <AuthBackButton onClick={goBack} />
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Account Verification
        </h1>
        <p>
          6-digit OTP code has been issued and sent to the provided email
          address. <br />
          <span className="font-semibold text-[#0AF5F3]">{email}</span>
        </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-1">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
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

            <Button
              size={"lg"}
              className="auth_button"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading && (
                <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm OTP
            </Button>
          </div>
        </form>
        <p className="px-8 text-center text-sm">
          If you have not received OTP check "Spams"
        </p>
        <span
          onClick={resendOtp}
          className="text-[#0AF5F3] text-center font-semibold cursor-pointer"
        >
          Send Again
        </span>
      </div>
    </>
  );
}
