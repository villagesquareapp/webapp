"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { VSAuthPadLock, VSPeopleIcon } from "components/icons/village-square";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { cn } from "lib/utils";
import { registerSchema, type RegisterFormValues } from "lib/validations/auth";
import Link from "next/link";
import * as React from "react";
import { useForm } from "react-hook-form";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner8 } from "react-icons/im";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { RiUserLine } from "react-icons/ri";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "components/ui/form";

interface RegisterProps extends React.HTMLAttributes<HTMLDivElement> {}

type IRegistrationType = "google" | "password" | "apple" | "facebook";

interface ISignup {
  username: string;
  email: string;
  name: string;
  password?: string;
  registration_type: IRegistrationType;
  provider?: IRegistrationType;
  timezone?: string;
  provider_id?: string;
  device_id?: string;
  device?: string;
  referrer_code?: string;
  fcm_token?: string;
}

const API_URL = process.env.API_URL;

export function Register({ className, ...props }: RegisterProps) {
  const [isPasswordAuthLoading, setIsPasswordAuthLoading] = React.useState<boolean>(false);
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = React.useState<boolean>(false);
  const [isAppleAuthLoading, setIsAppleAuthLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      referrer: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsPasswordAuthLoading(true);

    const signupData: ISignup = {
      username: values.username,
      email: values.email,
      name: values.name,
      password: values.password,
      registration_type: "password",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer_code: values.referrer,
    };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message);
      }

      console.log("The response:", data);
      toast.success("Registration successful!");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsPasswordAuthLoading(false);
    }
  }

  async function handleSocialSignup(provider: "google" | "apple") {
    if (provider === "google") {
      setIsGoogleAuthLoading(true);
    } else {
      setIsAppleAuthLoading(true);
    }

    const signupData: ISignup = {
      username: "", // This would typically come from the OAuth provider
      email: "", // This would typically come from the OAuth provider
      name: "", // This would typically come from the OAuth provider
      registration_type: provider,
      provider: provider,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      provider_id: "114468729516638108730", // This is just an example, it should come from the OAuth provider
      device_id: "browser", // You might want to generate a unique ID
      device: "web",
    };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        throw new Error("Social sign-up failed");
      }

      const data = await response.json();
      console.log("Social sign-up successful:", data);
      toast.success("Social sign-up successful!");
      // Handle successful registration (e.g., redirect to dashboard)
    } catch (err) {
      console.error("Social sign-up error:", err);
      toast.error("Social sign-up failed. Please try again.");
    } finally {
      if (provider === "google") {
        setIsGoogleAuthLoading(false);
      } else {
        setIsAppleAuthLoading(false);
      }
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Create Your Account!</h1>
        <p>Create your account to connect, share and explore with your magic world</p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <RiUserLine className="size-4" />
                          </div>
                          <Input
                            placeholder="Username"
                            type="text"
                            className="auth_input"
                            autoCapitalize="none"
                            autoComplete="username"
                            autoCorrect="off"
                            disabled={
                              isPasswordAuthLoading ||
                              isGoogleAuthLoading ||
                              isAppleAuthLoading
                            }
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <RiUserLine className="size-4" />
                          </div>
                          <Input
                            placeholder="Full Name"
                            type="text"
                            className="auth_input"
                            autoCapitalize="none"
                            autoComplete="name"
                            autoCorrect="off"
                            disabled={
                              isPasswordAuthLoading ||
                              isGoogleAuthLoading ||
                              isAppleAuthLoading
                            }
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <MdOutlineMail className="size-4 absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input
                            placeholder="Email"
                            type="email"
                            className="auth_input"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={
                              isPasswordAuthLoading ||
                              isGoogleAuthLoading ||
                              isAppleAuthLoading
                            }
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <VSAuthPadLock className="size-6 absolute left-2 top-[55%] -translate-y-1/2" />
                          <Input
                            placeholder="Password"
                            className="auth_input px-8"
                            type={showPassword ? "text" : "password"}
                            autoCapitalize="none"
                            autoComplete="new-password"
                            autoCorrect="off"
                            disabled={
                              isPasswordAuthLoading ||
                              isGoogleAuthLoading ||
                              isAppleAuthLoading
                            }
                            {...field}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="referrer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <VSPeopleIcon className="size-5 absolute left-3 top-[58%] -translate-y-1/2" />
                      <Input
                        placeholder="Referreral Code (Optional)"
                        type="text"
                        className="auth_input"
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect="off"
                        disabled={
                          isPasswordAuthLoading || isGoogleAuthLoading || isAppleAuthLoading
                        }
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="auth_button"
              disabled={isPasswordAuthLoading || isGoogleAuthLoading || isAppleAuthLoading}
            >
              {isPasswordAuthLoading && <ImSpinner8 className="h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2">or sign up with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="social_auth_button"
          disabled={isPasswordAuthLoading || isGoogleAuthLoading || isAppleAuthLoading}
          onClick={() => handleSocialSignup("google")}
        >
          {isGoogleAuthLoading ? (
            <ImSpinner8 className="h-4 w-4 animate-spin" />
          ) : (
            <FcGoogle className="!size-7" />
          )}{" "}
          <span className="-ml-1 font-semibold text-accent/70">Google</span>
        </Button>
        <Button
          variant="outline"
          type="button"
          className="social_auth_button"
          disabled={isPasswordAuthLoading || isGoogleAuthLoading || isAppleAuthLoading}
          onClick={() => handleSocialSignup("apple")}
        >
          {isAppleAuthLoading ? (
            <ImSpinner8 className="h-4 w-4 animate-spin" />
          ) : (
            <FaApple className="!size-6 text-black" />
          )}{" "}
          <span className="-ml-1.5 font-semibold text-accent/70">Apple</span>
        </Button>
      </div>
      <p className="px-8 text-center text-sm">
        I don't have an account{" "}
        <Link href="/auth/login" className="font-semibold">
          Sign In
        </Link>
      </p>
    </>
  );
}
