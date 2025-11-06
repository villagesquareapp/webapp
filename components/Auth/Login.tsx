"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { VSAuthPadLock } from "components/icons/village-square";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { cn } from "lib/utils";
import { loginSchema, type LoginFormValues } from "lib/validations/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner8 } from "react-icons/im";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { RiUserLine } from "react-icons/ri";
import { toast } from "sonner";
import { getTimeZone } from "lib/timezone";
import Image from "next/image";


interface LoginProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Login({ className, ...props }: LoginProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isAppleLoading, setIsAppleLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState<boolean>(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email_or_username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email_or_username: values.email_or_username,
        password: values.password,
        timezone: getTimeZone(),
        login_type: "password",
        // provider: "default",
        // provider_token: null,
        // device_id: null,
        // device: null,
        // fcm_token: null,
        // audience: "web",
        redirect: false,
        callbackUrl: "/dashboard/social",
      });

      if (!result) {
        throw new Error("Authentication failed");
      }

      if (result.error) {
        toast.error(result.error);
        console.log("Login error:", result.error);
      } else {
        setIsRedirecting(true);
        toast.success("Logged in successfully");
        router.push("/dashboard/social");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Authentication failed"
      );
      console.log("Login exception:", error);
      
    } finally {
      if (!isRedirecting) {
        setIsLoading(false);
      }
    }
  }

  // const handleGoogleLogin = async () => {
  //   try {
  //     setIsGoogleLoading(true);
  //     const result = await signIn("google", {
  //       redirect: false,
  //       callbackUrl: "/dashboard/social",
  //     });

  //     if (result?.error) {
  //       if (result.error.includes("?error=")) {
  //         const errorMessage = decodeURIComponent(result.error.split("?error=")[1]);
  //         toast.error(errorMessage);
  //       } else {
  //         toast.error(result.error);
  //       }
  //     } else if (result?.ok) {
  //       router.push("/dashboard/social");
  //     }
  //   } catch (error) {
  //     console.error("Google sign-in error:", error);
  //     toast.error("Failed to sign in with Google. Please try again.");
  //   } finally {
  //     setIsGoogleLoading(false);
  //   }
  // };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);

      const result = await signIn("google", {
        callbackUrl: "/dashboard/social", 
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
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
      <div className="flex flex-col space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome Back!</h1>
        <p>Sign In to connect, share and explore with your magic world</p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-6">
            <div className="grid gap-y-4">
              <FormField
                control={form.control}
                name="email_or_username"
                render={({ field }) => (
                  <FormItem className="grid gap-1">
                    <div className="relative">
                      <RiUserLine className="size-4 absolute left-2 top-[49%] -translate-y-1/2" />
                      <FormControl>
                        <Input
                          placeholder="Username / Email Address"
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
            </div>

            <p className="px-3 text-center text-sm">
              If you have forgotten your password{" "}
              <Link
                href="/auth/forgot-password"
                className="hover:text-foreground font-semibold"
              >
                Recover it
              </Link>
            </p>

            <Button
              type="submit"
              size={"lg"}
              className="auth_button"
              disabled={
                isLoading || isAppleLoading || isGoogleLoading || isRedirecting
              }
            >
              {(isLoading || isRedirecting) && (
                <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isRedirecting ? "Redirecting..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sn">
            <span className="bg-background px-2">or sign in with</span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          className="social_auth_button"
          disabled={isAppleLoading || isGoogleLoading || isLoading}
          onClick={handleGoogleLogin}
        >
          {isGoogleLoading ? (
            <ImSpinner8 className="h-4 w-4 animate-spin" />
          ) : (
            <FcGoogle className="!size-7" />
          )}{" "}
          <span className="-ml-1 font-semibold text-accent/70">Google</span>
        </Button>
        {/* <Button
          variant="outline"
          type="button"
          className="social_auth_button"
          disabled={isAppleLoading || isGoogleLoading || isLoading}
          onClick={handleAppleLogin}
        >
          {isAppleLoading ? (
            <ImSpinner8 className="h-4 w-4 animate-spin" />
          ) : (
            <FaApple className="!size-6 text-black" />
          )}{" "}
          <span className="-ml-1.5 font-semibold text-accent/70">Apple</span>
        </Button> */}
      </div>
      <p className="px-8 text-center text-sm">
        I don't have an account{" "}
        <Link
          href="/auth/register"
          className="hover:text-foreground font-semibold"
        >
          Register Now
        </Link>
      </p>
      <div className="flex items-center w-full justify-between mt-6">
      <Link
        href="https://play.google.com/store/apps/details?id=io.villagesquare.app"
        target="_blank"
      >
        <Image
          src="/images/play_store.png"
          alt="Get it on Google Play"
          width={220}
          height={50}
          className="object-contain"
        />
      </Link>

      <Link
        href="https://apps.apple.com/ng/app/villagesquare/id6746132330"
        target="_blank"
      >
        <Image
          src="/images/app_store.png"
          alt="Download on the App Store"
          width={220}
          height={50}
          className="object-contain"
        />
      </Link>
    </div>
    </>
  );
}
