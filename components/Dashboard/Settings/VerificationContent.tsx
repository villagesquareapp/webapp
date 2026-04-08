"use client";

import React from "react";
import { Check } from "lucide-react";
import { MdVerified } from "react-icons/md";

const VerificationContent = () => {
    return (
        <div className="max-w-[500px] pt-2">
            <h2 className="text-[22px] text-foreground font-semibold mb-1">Get Verified on VillageSquare</h2>
            <p className="text-foreground text-sm mb-8">Complete this action on the mobile app</p>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Column 1: Green Check Verification */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-6">
                        <MdVerified className="text-green-500 w-[22px] h-[22px]" />
                        <h3 className="font-semibold text-[15px] text-foreground">Green Check Verification</h3>
                    </div>

                    {/* Benefits 1 */}
                    <div className="mb-8">
                        <h4 className="font-semibold text-sm mb-4 text-foreground">Benefits</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="dark:bg-[#1A1E29] bg-[#eaeae8] p-1 rounded-md shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-muted-foreground">Boost trust & credibility</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="dark:bg-[#1A1E29] bg-[#eaeae8] p-1 rounded-md shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-muted-foreground">Protect your identity</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="dark:bg-[#1A1E29] bg-[#eaeae8] p-1 rounded-md shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-muted-foreground">Get recognized across VillageSquare</span>
                            </li>
                        </ul>
                    </div>

                    {/* Requirements 1 */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-sm text-foreground mb-4">Requirements & Criteria</h4>
                        <ul className="space-y-3.5 list-none">
                            <li className="text-sm text-muted-foreground opacity-90 pl-1">Payment required</li>
                            <li className="text-sm text-muted-foreground opacity-90 pl-1">Minimum of 5,000 followers</li>
                            <li className="text-sm text-muted-foreground opacity-90 pl-1">Account active 3+ months</li>
                            <li className="text-sm text-muted-foreground opacity-90 pl-1">Fullname, Gov't ID, DOB</li>
                            <li className="text-sm text-muted-foreground opacity-90 pl-1">Residential Address + Utility Bill</li>
                        </ul>
                    </div>

                    {/* Button 1 */}
                    <button disabled className="w-full bg-[#1717190D] dark:bg-[#18181A] border border-border rounded-xl py-3.5 text-[13px] font-medium text-muted-foreground opacity-80 cursor-not-allowed">
                        Subscribe for <span className="line-through mx-0.5">N</span>10,000 / month
                    </button>
                    {/* Wait, the UI has a real Naira symbol ₦ */}
                </div>

                {/* Column 2: Premium Verification */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-6 md:pl-2">
                        <MdVerified className="text-yellow-500 w-[22px] h-[22px]" />
                        <h3 className="font-semibold text-[15px] text-foreground">Premium Verification</h3>
                    </div>

                    {/* Benefits 2 */}
                    <div className="mb-8 md:pl-2">
                        <h4 className="font-semibold text-foreground text-sm mb-4">Benefits</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="dark:bg-[#1A1E29] bg-[#eaeae8] p-1 rounded-md shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-muted-foreground">Priority support</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="dark:bg-[#1A1E29] bg-[#eaeae8] p-1 rounded-md shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-muted-foreground">Exclusive features</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="dark:bg-[#1A1E29] bg-[#eaeae8] p-1 rounded-md shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />
                                </div>
                                <span className="text-sm text-muted-foreground leading-snug">Extra visibility in search<br />& feeds</span>
                            </li>
                        </ul>
                    </div>

                    {/* Requirements 2 */}
                    <div className="mb-6 md:pl-2">
                        <h4 className="font-semibold text-sm mb-4">Requirements & Criteria</h4>
                        <ul className="space-y-3.5 list-none">
                            <li className="text-sm text-muted-foreground opacity-90 pl-1">Payment required</li>
                            <li className="text-sm text-muted-foreground opacity-90 pl-1">Minimum of 20,000 followers</li>
                            <li className="text-sm text-muted-foreground opacity-90 pl-1">No recent policy violations</li>
                            <li className="text-sm text-muted-foreground opacity-90 pl-1">Fullname, Gov't ID, DOB</li>
                            <li className="text-sm text-muted-foreground opacity-90 pl-1">Residential Address + Utility Bill</li>
                        </ul>
                    </div>

                    {/* Button 2 */}
                    <div className="md:pl-2">
                        <button disabled className="w-full bg-[#1717190D] dark:bg-[#18181A] border border-border rounded-xl py-3.5 text-[13px] font-medium text-muted-foreground opacity-80 cursor-not-allowed">
                            Subscribe for ₦30,000 / month
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VerificationContent;
