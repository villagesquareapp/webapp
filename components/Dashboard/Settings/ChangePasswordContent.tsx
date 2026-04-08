"use client";

import React from "react";
import Link from "next/link";

const ChangePasswordContent = () => {
    return (
        <div className="max-w-[500px] pt-4 lg:pt-4 w-full mx-auto md:mx-0">
            <h2 className="text-[22px] text-foreground font-semibold mb-1">Change your password</h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed pr-8">
                Your password must be at least 6 characters long and include a mix of
                letters, numbers, and special characters (e.g, !@%_).
            </p>

            <div className="space-y-4 mb-4">
                <div className="bg-background rounded-xl p-4 border border-border focus-within:border-neutral-500 transition-colors">
                    <input
                        type="password"
                        placeholder="Current password"
                        className="bg-transparent text-foreground text-sm w-full focus:outline-none placeholder:text-muted-foreground"
                    />
                </div>

                <div className="bg-background rounded-xl p-4 border border-border focus-within:border-neutral-500 transition-colors">
                    <input
                        type="password"
                        placeholder="New password"
                        className="bg-transparent text-foreground text-sm w-full focus:outline-none placeholder:text-muted-foreground"
                    />
                </div>

                <div className="bg-background rounded-xl p-4 border border-border focus-within:border-neutral-500 transition-colors">
                    <input
                        type="password"
                        placeholder="Confirm password"
                        className="bg-transparent text-foreground text-sm w-full focus:outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="mb-12">
                <Link href="#" className="text-blue-600 text-sm hover:underline">
                    Forgot password?
                </Link>
            </div>

            <div className="flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-colors">
                    Change password
                </button>
            </div>
        </div>
    );
};

export default ChangePasswordContent;
