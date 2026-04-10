"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import ForgotPasswordModal from "./ForgotPasswordModal";

const ChangePasswordContent = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        if (!currentPassword.trim()) {
            newErrors.current = "Current password is required";
        }

        if (!newPassword.trim()) {
            newErrors.new = "New password is required";
        } else if (newPassword.length < 6) {
            newErrors.new = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(newPassword)) {
            newErrors.new = "Password must include letters, numbers, and special characters";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirm = "Please confirm your new password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirm = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate() || isLoading) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/users/settings/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });
            const result = await res.json();

            if (result?.status) {
                toast.success(result.message || "Password Updated Successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setErrors({});
            } else {
                toast.error(result?.message || "Failed to update password");
            }
        } catch (error) {
            console.error("Password update error:", error);
            toast.error("An error occurred while updating your password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-[500px] pt-4 lg:pt-4 w-full mx-auto md:mx-0">
            <h2 className="text-[22px] text-foreground font-semibold mb-1">Change your password</h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed pr-8">
                Your password must be at least 6 characters long and include a mix of
                letters, numbers, and special characters (e.g, !@%_).
            </p>

            <div className="space-y-4 mb-4">
                <div>
                    <div className={`bg-background rounded-xl p-4 border transition-colors flex items-center gap-2 ${errors.current ? "border-red-500" : "border-border focus-within:border-neutral-500"}`}>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                if (errors.current) setErrors((prev) => ({ ...prev, current: undefined }));
                            }}
                            className="bg-transparent text-foreground text-sm w-full focus:outline-none placeholder:text-muted-foreground"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        >
                            {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.current && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.current}</p>}
                </div>

                <div>
                    <div className={`bg-background rounded-xl p-4 border transition-colors flex items-center gap-2 ${errors.new ? "border-red-500" : "border-border focus-within:border-neutral-500"}`}>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (errors.new) setErrors((prev) => ({ ...prev, new: undefined }));
                            }}
                            className="bg-transparent text-foreground text-sm w-full focus:outline-none placeholder:text-muted-foreground"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        >
                            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.new && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.new}</p>}
                </div>

                <div>
                    <div className={`bg-background rounded-xl p-4 border transition-colors flex items-center gap-2 ${errors.confirm ? "border-red-500" : "border-border focus-within:border-neutral-500"}`}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: undefined }));
                            }}
                            className="bg-transparent text-foreground text-sm w-full focus:outline-none placeholder:text-muted-foreground"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        >
                            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.confirm && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirm}</p>}
                </div>
            </div>

            <div className="mb-12">
                <button
                    onClick={(e) => { e.preventDefault(); setIsForgotModalOpen(true); }}
                    className="text-blue-600 text-sm hover:underline"
                >
                    Forgot password?
                </button>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                    {isLoading && <Loader2 className="size-4 animate-spin" />}
                    {isLoading ? "Updating..." : "Change password"}
                </button>
            </div>

            <ForgotPasswordModal
                isOpen={isForgotModalOpen}
                onClose={() => setIsForgotModalOpen(false)}
            />
        </div>
    );
};

export default ChangePasswordContent;
