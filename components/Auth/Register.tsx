"use client";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { cn } from "lib/utils";
import Link from "next/link";
import * as React from "react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner8 } from "react-icons/im";

interface RegisterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Register({ className, ...props }: RegisterProps) {
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
        <h1 className="text-2xl font-semibold tracking-tight">Create Your Account!</h1>
        <p className="text-sm text-muted-foreground font-semibold">
          Create your account to connect, share and explore with your magic world
        </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={onSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Input
                  id="username"
                  placeholder="Username"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-1">
                <Input
                  id="name"
                  placeholder="Full Name"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-1">
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <Input
              id="referrer"
              placeholder="Referrer"
              type="text"
              autoCapitalize="none"
              autoComplete="referrer"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or sign up with</span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={isLoading}>
          {isLoading ? (
            <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FcGoogle className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
        <Button variant="outline" type="button" disabled={isLoading}>
          {isLoading ? (
            <ImSpinner8 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FaApple className="mr-2 h-4 w-4" />
          )}{" "}
          Apple
        </Button>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        I don't have an account{" "}
        <Link href="/auth/login" className="hover:text-primary font-semibold">
          Sign In
        </Link>
      </p>
    </>
  );
}
