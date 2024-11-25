"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "components/ui/form";
import { Input } from "components/ui/input";
import { cn } from "lib/utils";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "lib/validations/auth";
import * as React from "react";
import { useForm } from "react-hook-form";
import { ImSpinner8 } from "react-icons/im";
import { RiMailLine } from "react-icons/ri";
import { toast } from "sonner";
import AuthBackButton from "./AuthBackButton";

interface ForgotPasswordProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPassword({ className, ...props }: ForgotPasswordProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);

    try {
      // TODO: Implement your password reset logic here
      console.log(values);

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Password reset email sent successfully");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AuthBackButton />
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Forgot Password?</h1>
        <p>Reset your password effortlessly by requesting an email confirmation.</p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <div className="relative">
                    <RiMailLine className="size-4 absolute left-2 top-[49%] -translate-y-1/2" />
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="email"
                        className="auth_input"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
            <Button type="submit" className="auth_button" disabled={isLoading}>
              {isLoading && <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
