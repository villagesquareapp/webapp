"use client";

import { useGuest } from "context/GuestContext";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { RiUserLine } from "react-icons/ri";

export default function GuestLoginModal() {
    const { showLoginModal, closeLoginModal, currentPath } = useGuest();

    if (!showLoginModal) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={closeLoginModal}
        >
            <div
                className="bg-background border border-border rounded-2xl w-full max-w-[420px] mx-4 p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <div className="flex justify-end mb-2">
                    <button
                        onClick={closeLoginModal}
                        className="p-1 hover:bg-accent rounded-full transition-colors"
                    >
                        <IoClose className="size-5 text-muted-foreground" />
                    </button>
                </div>

                <h2 className="text-[20px] font-bold text-foreground text-center mb-6">
                    Log in to VillageSquare
                </h2>

                <div className="flex flex-col gap-3">
                    {/* Email / username */}
                    <Link
                        href={`/auth/login`}
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                localStorage.setItem("redirectAfterLogin", currentPath);
                            }
                        }}
                        className="flex items-center justify-center gap-3 w-full h-12 rounded-full border border-border bg-accent hover:bg-accent/80 text-foreground font-medium text-[14px] transition-colors"
                    >
                        <RiUserLine className="size-5" />
                        Use email / username
                    </Link>

                    {/* Google */}
                    <Link
                        href={`/auth/login`}
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                localStorage.setItem("redirectAfterLogin", currentPath);
                            }
                        }}
                        className="flex items-center justify-center gap-3 w-full h-12 rounded-full border border-border bg-accent hover:bg-accent/80 text-foreground font-medium text-[14px] transition-colors"
                    >
                        <FcGoogle className="size-5" />
                        Continue with Google
                    </Link>
                </div>

                <p className="text-[12px] text-muted-foreground text-center mt-5 leading-relaxed">
                    By continuing, you agree to our{" "}
                    <Link href="/en/tac" className="font-semibold text-foreground hover:underline">
                        Terms and Condition
                    </Link>{" "}
                    and acknowledge our{" "}
                    <Link href="/en/privacy-policy" className="font-semibold text-foreground hover:underline">
                        Privacy Policy
                    </Link>
                    .
                </p>

                <div className="mt-5 text-center text-[13px] text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/auth/register"
                        className="text-[#0D52D2] font-semibold hover:underline"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
