"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { register, socialRegister, verifyEmail } from "app/api/auth";
import { VSAuthPadLock, VSPeopleIcon } from "components/icons/village-square";
import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { messageHandler } from "lib/messageHandler";
import { cn } from "lib/utils";
import { registerSchema, type RegisterFormValues } from "lib/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner8 } from "react-icons/im";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { RiUserLine } from "react-icons/ri";
import { toast } from "sonner";
import { AccountVerification } from "./AccountVerification";
import { signIn, useSession } from "next-auth/react";

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

export function Register({ className, ...props }: RegisterProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPasswordAuthLoading, setIsPasswordAuthLoading] =
    React.useState<boolean>(false);
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] =
    React.useState<boolean>(false);
  const [isAppleAuthLoading, setIsAppleAuthLoading] =
    React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [redirecting, setRedirecting] = React.useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = React.useState<boolean>(false);

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

  const accountOtpVerification = async () => {
    try {
      const values = form.getValues();
      console.log("VALUES:", values);
      const response = await register({
        username: values.username,
        email: values.email,
        name: values.name,
        password: values.password,
        referrer_code: values.referrer || undefined,
      });

      if (!response?.status) {
        toast.error(messageHandler(response?.message));
      } else {
        toast.success(response?.message);
        setRedirecting(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      }
      return response;
    } catch (err) {
      console.error("Registration error:", err);
      const error = err instanceof Error ? err.message : "Registration failed";
      toast.error(error);
      setIsPasswordAuthLoading(false);
      return {
        status: false,
        message: error,
        data: undefined,
      };
    }
  };

  async function onSubmit(values: RegisterFormValues) {
    setIsPasswordAuthLoading(true);

    try {
      const result = await verifyEmail({
        email: values.email,
        username: values.username,
      });

      if (!!result?.status) {
        setIsEmailVerified(true);
        setIsPasswordAuthLoading(false);
      } else {
        toast.error(messageHandler(result?.message));
        setIsPasswordAuthLoading(false);
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err instanceof Error ? err.message : "Registration failed");
      setIsPasswordAuthLoading(false);
    }
  }

  // async function handleSocialSignup(provider: "google" | "apple") {
  //   if (provider === "google") {
  //     setIsGoogleAuthLoading(true);
  //   } else {
  //     setIsAppleAuthLoading(true);
  //   }

  //   try {
  //     const response = await socialRegister({
  //       provider,
  //       provider_id: "114468729516638108730", // This should come from OAuth
  //       device_id: "browser",
  //       device: "web",
  //     });

  //     if (!response?.status) {
  //       throw new Error(response?.message || "Social sign-up failed");
  //     }

  //     toast.success(response.message || "Social sign-up successful!");
  //   } catch (err) {
  //     console.error("Social sign-up error:", err);
  //     toast.error(err instanceof Error ? err.message : "Social sign-up failed");
  //   } finally {
  //     if (provider === "google") {
  //       setIsGoogleAuthLoading(false);
  //     } else {
  //       setIsAppleAuthLoading(false);
  //     }
  //   }
  // }

  // async function handleGoogleLogin() {
  //   setIsGoogleAuthLoading(true);
  //   try {
  //     const result = await signIn("google", {
  //       redirect: false,
  //       callbackUrl: "/dashboard/social",
  //     });
  //     if (result?.error) {
  //       toast.error(result.error);
  //     }
  //   } catch (error) {
  //     console.error("Google sign-in error:", error);
  //     toast.error("Failed to sign in with Google.");
  //   } finally {
  //     setIsGoogleAuthLoading(false);
  //   }
  // }

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleAuthLoading(true);
  
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
      setIsGoogleAuthLoading(false);
    }
  };

  React.useEffect(() => {
    async function handleSocial() {
      if (!session?.user?.provider_token) return;

      try {
        const response = await socialRegister({
          provider: 'google',
          provider_id: session.user.provider_id!,
          provider_token: session.user.provider_token,
          device_id: 'browser',
          device: 'web'
        });

        if (!response?.status) throw new Error(response?.message);

        toast.success('Login successful!');
        router.replace('/dashboard/social');
      } catch (err: any) {
        toast.error(err.message || 'Social login failed');
        router.replace('/auth/login');
      }
    }

    handleSocial();
  }, [session, router]);

  return (
    <>
      {!isEmailVerified ? (
        <>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create Your Account!
            </h1>
            <p>
              Create your account to connect, share and explore with your magic
              world
            </p>
          </div>
          <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4"
              >
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
                <Button
                  type="submit"
                  className="auth_button"
                  disabled={
                    redirecting ||
                    isPasswordAuthLoading ||
                    isGoogleAuthLoading ||
                    isAppleAuthLoading
                  }
                >
                  {(isPasswordAuthLoading || redirecting) && (
                    <ImSpinner8 className="h-4 w-4 animate-spin" />
                  )}
                  {redirecting ? "Redirecting..." : "Sign Up"}
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
              disabled={
                isPasswordAuthLoading ||
                isGoogleAuthLoading ||
                isAppleAuthLoading
              }
              // onClick={() => handleSocialSignup("google")}
              // onClick={handleGoogleLogin}
              onClick={handleGoogleLogin}
            >
              {isGoogleAuthLoading ? (
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
              disabled={isPasswordAuthLoading || isGoogleAuthLoading || isAppleAuthLoading}
              onClick={() => handleSocialSignup("apple")}
            >
              {isAppleAuthLoading ? (
                <ImSpinner8 className="h-4 w-4 animate-spin" />
              ) : (
                <FaApple className="!size-6 text-black" />
              )}{" "}
              <span className="-ml-1.5 font-semibold text-accent/70">Apple</span>
            </Button> */}
          </div>
          <p className="px-8 text-center text-sm">
            I don't have an account{" "}
            <Link href="/auth/login" className="font-semibold">
              Sign In
            </Link>
          </p>
        </>
      ) : (
        <AccountVerification
          email={form.getValues().email}
          username={form.getValues().username}
          extraFunction={accountOtpVerification}
          goBack={() => setIsEmailVerified(false)}
        />
      )}
    </>
  );
}
