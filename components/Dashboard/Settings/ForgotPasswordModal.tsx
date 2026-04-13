"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const [identifier, setIdentifier] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!identifier.trim()) return;
        setIsLoading(true);
        try {
            // In a real implementation this would hit the API
            // const res = await fetch("/api/users/settings/forgot-password", ...);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Password reset instructions sent");
            setIdentifier("");
            onClose();
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="fixed top-[35%] left-1/2 -translate-x-1/2 w-[90%] max-w-[550px] border border-border bg-background sm:bg-background shadow-2xl rounded-2xl p-12 sm:p-8">
                <div className="flex flex-col gap-6 mt-2">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-foreground text-lg font-semibold">Forgot password</h2>
                        <p className="text-muted-foreground text-[14px] leading-relaxed">
                            Provide the email address, phone number or username linked to your account to reset your password.
                        </p>
                    </div>

                    <div className="bg-transparent rounded-xl p-3 sm:p-4 border border-border focus-within:border-neutral-500 transition-colors mt-2">
                        <input
                            type="text"
                            placeholder="Email, phone number or username"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="bg-transparent text-foreground text-[14px] w-full focus:outline-none placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-2 mb-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !identifier.trim()}
                            className="w-full bg-[#1848B4] hover:bg-[#1848B4]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="size-4 animate-spin" />}
                            Reset password
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full text-muted-foreground hover:text-foreground text-sm transition-colors"
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
