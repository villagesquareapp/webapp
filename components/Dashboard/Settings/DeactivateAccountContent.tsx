"use client";

import React, { useState } from "react";
import Link from "next/link";

type FlowStep = "selection" | "deactivate_password" | "delete_warning" | "delete_password";
type SelectionType = "deactivate" | "delete" | null;

const DeactivateAccountContent = () => {
    const [step, setStep] = useState<FlowStep>("selection");
    const [selection, setSelection] = useState<SelectionType>(null);
    const [password, setPassword] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState("");

    const handleContinueSelection = () => {
        if (selection === "deactivate") {
            setStep("deactivate_password");
        } else if (selection === "delete") {
            setStep("delete_warning");
        }
    };

    const isDeleteEnabled = password.length > 0 && deleteConfirmation === "DELETE";

    return (
        <div className="max-w-[500px] pt-4 lg:pt-8 w-full mx-auto md:mx-0 pb-16">

            {/* Step 1: Selection */}
            {step === "selection" && (
                <>
                    <h2 className="text-[22px] font-semibold mb-1">Deactivate / delete account</h2>
                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed pr-8">
                        If you need a break, you can temporarily deactivate your account. Your
                        profile and content will be hidden until you return.
                    </p>

                    <div className="space-y-6 mb-10">
                        {/* Deactivate Option */}
                        <div
                            onClick={() => setSelection("deactivate")}
                            className={`border rounded-xl p-5 cursor-pointer transition-colors ${selection === "deactivate" ? "border-blue-500 bg-[#1A1E29]" : "border-[#2C2C2E] bg-[#18181A] hover:bg-[#202022]"
                                }`}
                        >
                            <h3 className="font-semibold text-[15px] mb-2 text-[#E0E0E0]">Deactivate account</h3>
                            <p className="text-[13px] text-muted-foreground leading-relaxed pr-4">
                                Deactivating your account is temporary. Your profile and
                                activity will be hidden on VillageSquare until you reactivate
                                it by logging back into your account.
                            </p>
                        </div>

                        {/* Delete Option */}
                        <div
                            onClick={() => setSelection("delete")}
                            className={`border rounded-xl p-5 cursor-pointer transition-colors ${selection === "delete" ? "border-red-500 bg-[#291A1A]" : "border-[#2C2C2E] bg-[#18181A] hover:bg-[#202022]"
                                }`}
                        >
                            <h3 className="font-semibold text-[15px] mb-2 text-[#E0E0E0]">Delete account</h3>
                            <p className="text-[13px] text-muted-foreground leading-relaxed pr-4">
                                Deleting your VillageSquare account is permanent. Once
                                deleted, your profile, posts, photos, videos, comments,
                                likes, and connections will be permanently removed and
                                cannot be recovered.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            disabled={!selection}
                            onClick={handleContinueSelection}
                            className={`font-medium py-2.5 px-8 rounded-lg text-[15px] transition-colors ${selection ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-[#252528] text-muted-foreground cursor-not-allowed"
                                }`}
                        >
                            Continue
                        </button>
                    </div>
                </>
            )}

            {/* Step 2: Deactivate Password */}
            {step === "deactivate_password" && (
                <>
                    <h2 className="text-[22px] font-semibold mb-1">Confirm your password</h2>
                    <p className="text-muted-foreground text-[15px] mb-8 leading-relaxed pr-8">
                        To complete your deactivation request, enter the password linked to
                        your account.
                    </p>

                    <div className="bg-[#18181A] rounded-xl p-4 border border-[#2C2C2E] focus-within:border-neutral-500 transition-colors mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent text-[15px] w-full focus:outline-none placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="mb-12">
                        <Link href="#" className="text-blue-600 text-[15px] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <div className="flex justify-end">
                        <button
                            disabled={!password}
                            className={`font-medium py-2.5 px-10 rounded-xl text-[15px] transition-colors ${password ? "bg-[#C62828] hover:bg-[#B71C1C] text-white" : "bg-[#252528] text-muted-foreground cursor-not-allowed"
                                }`}
                        >
                            Deactivate
                        </button>
                    </div>
                </>
            )}

            {/* Step 3: Delete Warning */}
            {step === "delete_warning" && (
                <>
                    <h2 className="text-[22px] font-semibold mb-6">Delete account?</h2>

                    <div className="mb-6">
                        <p className="text-[#E0E0E0] text-[15px] mb-1">Deleting your account is permanent.</p>
                        <p className="text-[#E0E0E0] text-[15px] pr-8">
                            Once deleted, your profile, posts, photos, videos, comments,
                            likes and connections will be permanently removed.
                        </p>
                    </div>

                    <p className="text-[#E0E0E0] font-semibold text-[15px] mb-6">
                        This action cannot be undone.
                    </p>

                    <div className="h-px bg-[#2C2C2E] w-full mb-6" />

                    <p className="text-muted-foreground text-[13px] mb-6 pr-8">
                        If you're not sure, you can deactivate your account instead.
                    </p>

                    <button
                        onClick={() => {
                            setSelection("deactivate");
                            setStep("deactivate_password");
                        }}
                        className="text-blue-600 hover:text-blue-500 text-[15px] transition-colors inline-block mb-12"
                    >
                        Deactivate instead
                    </button>

                    <div className="flex justify-end">
                        <button
                            onClick={() => setStep("delete_password")}
                            className="bg-[#C62828] hover:bg-[#B71C1C] text-white font-medium py-3 px-6 rounded-full text-[15px] transition-colors"
                        >
                            Continue to delete
                        </button>
                    </div>
                </>
            )}

            {/* Step 4: Delete Password Confirmation */}
            {step === "delete_password" && (
                <>
                    <h2 className="text-[22px] font-semibold mb-6">Confirm account deletion</h2>

                    <p className="text-[#E0E0E0] text-[15px] mb-10">
                        To confirm, enter the password linked to your account.
                    </p>

                    <div className="space-y-4 mb-16">
                        <div className="bg-[#18181A] rounded-xl p-4 py-4 border border-[#2C2C2E] focus-within:border-neutral-500 transition-colors">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-transparent text-[15px] w-full focus:outline-none placeholder:text-[#A0A0A0]"
                            />
                        </div>

                        <div className="bg-[#18181A] rounded-xl p-4 py-4 border border-[#2C2C2E] focus-within:border-neutral-500 transition-colors">
                            <input
                                type="text"
                                placeholder="Type DELETE to confirm"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                className="bg-transparent text-[15px] w-full focus:outline-none placeholder:text-[#A0A0A0]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            disabled={!isDeleteEnabled}
                            className={`font-medium py-3 px-10 rounded-full text-[15px] transition-colors ${isDeleteEnabled ? "bg-[#C62828] hover:bg-[#B71C1C] text-white" : "bg-[#252528] text-muted-foreground cursor-not-allowed"
                                }`}
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}

        </div>
    );
};

export default DeactivateAccountContent;
