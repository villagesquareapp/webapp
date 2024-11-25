"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { cn } from "lib/utils";
import * as React from "react";
import { useForm } from "react-hook-form";
import { ImSpinner8 } from "react-icons/im";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Link from "next/link";
import { VSAuthPadLock } from "components/icons/village-square";
import { Form, FormControl, FormField, FormItem, FormMessage } from "components/ui/form";
import * as z from "zod";
import AuthBackButton from "./AuthBackButton";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResetPassword({ className, ...props }: ResetPasswordProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setIsLoading(true);

    // Add your reset password logic here
    console.log(values);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <>
      <AuthBackButton />
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Reset Password</h1>
        <p>You can now proceed to set a new password for your account. </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-1">
                    <div className="relative">
                      <VSAuthPadLock className="size-6 absolute left-2 top-[55%] -translate-y-1/2" />
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type={showPassword ? "text" : "password"}
                          autoCapitalize="none"
                          className="auth_input px-8"
                          autoComplete="current-password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <IoEyeOffOutline className="h-4 w-4" />
                        ) : (
                          <IoEyeOutline className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
              <Button className="auth_button" disabled={isLoading}>
                {isLoading && <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </div>
          </form>
        </Form>

        <p className="px-8 text-center text-sm">
          Go back to{" "}
          <Link href="/auth/login" className="hover:text-foreground font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
