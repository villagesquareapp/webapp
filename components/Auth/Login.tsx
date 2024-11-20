"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { cn } from "lib/utils";
import { loginSchema, type LoginFormValues } from "lib/validations/auth";
import { RiUserLine } from "react-icons/ri";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner8 } from "react-icons/im";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import { VSAuthPadLock } from "components/icons/village-square";

interface LoginProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Login({ className, ...props }: LoginProps) {
  const [isEmailOrUsernameLoading, setIsEmailOrUsernameLoading] =
    React.useState<boolean>(false);
  const [isAppleLoading, setIsAppleLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email_or_username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsEmailOrUsernameLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email_or_username,
        password: values.password,
        login_type: "password",
        redirect: false,
        callbackUrl: "/dashboard/social",
      });

      if (!result) {
        throw new Error("No result from signIn");
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        router.push("/dashboard/social");
        toast.success("Logged in successfully");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(typeof error === "string" ? error : "Something went wrong");
    } finally {
      setIsEmailOrUsernameLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard/social",
      });

      console.log("Google sign-in result:", result);

      if (result?.error) {
        if (result.error.includes("?error=")) {
          const errorMessage = decodeURIComponent(result.error.split("?error=")[1]);
          toast.error(errorMessage);
        } else {
          toast.error(result.error);
        }
      } else if (result?.ok) {
        router.push("/dashboard/social");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsAppleLoading(true);
      const result = await signIn("apple", { callbackUrl: "/dashboard" });
      if (result?.error) {
        toast.error(result.error);
      } else {
        router.push("/dashboard/social");
        toast.success("Logged in successfully");
      }
    } catch (error) {
      toast.error("Failed to sign in with Apple");
    } finally {
      setIsAppleLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back!</h1>
        <p className="text-sm text-muted-foreground font-semibold">
          Sign In to connect, share and explore with your magic world
        </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-y-6">
            <div className="grid gap-y-3">
              <div className="grid gap-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <RiUserLine className="size-4" />
                </div>
                <Input
                  id="email_or_username"
                  placeholder="Username / Email Address"
                  type="email"
                  className="pl-8"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isEmailOrUsernameLoading}
                  {...form.register("email_or_username")}
                />
                {form.formState.errors.email_or_username && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email_or_username.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <div className="relative">
                  <VSAuthPadLock className="size-6 absolute left-2 top-[55%] -translate-y-1/2" />
                  <Input
                    id="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    autoCapitalize="none"
                    className="px-8"
                    autoComplete="current-password"
                    disabled={isEmailOrUsernameLoading}
                    {...form.register("password")}
                  />
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
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <p className="px-3 text-center text-sm text-muted-foreground">
              If you have forgot your password{" "}
              <Link href="/auth/reset-password" className="hover:text-primary font-semibold">
                Recover it
              </Link>
            </p>
            <Button
              type="submit"
              disabled={isEmailOrUsernameLoading || isAppleLoading || isGoogleLoading}
            >
              {isEmailOrUsernameLoading && (
                <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or sign in with</span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          className="bg-foreground text-background"
          disabled={isAppleLoading || isGoogleLoading || isEmailOrUsernameLoading}
          onClick={handleGoogleLogin}
        >
          {isGoogleLoading ? (
            <ImSpinner8 className="h-4 w-4 animate-spin" />
          ) : (
            <FcGoogle className=" size-5" />
          )}{" "}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          className="bg-foreground text-background"
          disabled={isAppleLoading || isGoogleLoading || isEmailOrUsernameLoading}
          onClick={handleAppleLogin}
        >
          {isAppleLoading ? (
            <ImSpinner8 className="h-4 w-4 animate-spin" />
          ) : (
            <FaApple className="size-6" />
          )}{" "}
          Apple
        </Button>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        I don't have an account{" "}
        <Link href="/auth/register" className="hover:text-primary font-semibold">
          Register Now
        </Link>
      </p>
    </>
  );
}
