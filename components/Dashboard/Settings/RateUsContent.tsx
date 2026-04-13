"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

const improvementTags = [
    "Bugs or glitches",
    "Slow performance",
    "Confusing interface",
    "Missing features",
    "Privacy concerns",
    "Other"
];

const featureTags = [
    "Marketplace",
    "Echo",
    "Tribes",
    "African talent challenge"
];

const RateUsContent = () => {
    const [rating, setRating] = useState<number>(5);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const toggleImprovement = (tag: string) => {
        if (selectedImprovements.includes(tag)) {
            setSelectedImprovements(selectedImprovements.filter(t => t !== tag));
        } else {
            setSelectedImprovements([...selectedImprovements, tag]);
        }
    };

    const toggleFeature = (tag: string) => {
        if (selectedFeatures.includes(tag)) {
            setSelectedFeatures(selectedFeatures.filter(t => t !== tag));
        } else {
            setSelectedFeatures([...selectedFeatures, tag]);
        }
    };

    return (
        <div className="max-w-[800px] pt-4 lg:pt-8 w-full mx-auto md:mx-0">
            <h2 className="text-[22px] text-foreground font-semibold mb-1">How's your experience on VillageSquare?</h2>
            <p className="text-muted-foreground text-sm mb-8">Your feedback helps us build a better community for you.</p>

            <div className="dark:bg-[#18181A]/40 bg-[#eaeae8] border border-border rounded-xl p-8 max-w-[500px]">

                {/* Star Rating Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex gap-4 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className="focus:outline-none transition-transform hover:scale-110"
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`w-[42px] h-[42px] ${(hoveredRating || rating) >= star
                                        ? "fill-[#FBBF24] text-[#FBBF24]"
                                        : "fill-[#2C2C2E] text-[#2C2C2E]"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Labels under stars */}
                    <div className="flex justify-between w-[260px] text-[13px] text-muted-foreground mb-8">
                        <span>Poor</span>
                        <span>Okay</span>
                        <span>Amazing</span>
                    </div>

                    {/* App Store CTA */}
                    <p className="text-[15px] font-medium mb-4 text-foreground">We're glad you love VillageSquare 💙</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg text-sm transition-colors">
                        Leave a review on App Store
                    </button>
                </div>

                <div className="h-px bg-[#2C2C2E] w-full my-8" />

                {/* Improvements Section */}
                <div className="mb-8">
                    <h3 className="text-[15px] text-foreground font-medium mb-4 text-center md:text-left">What could we do better?</h3>
                    <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
                        {improvementTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleImprovement(tag)}
                                className={`px-4 py-2 rounded-lg text-[13px] border transition-colors ${selectedImprovements.includes(tag)
                                    ? "bg-blue-600/10 border-blue-600 text-blue-500"
                                    : "border-border bg-[#dfdfde] dark:bg-[#252527] text-muted-foreground dark:hover:bg-[#202022]"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    <div className="dark:bg-[#18181A] bg-[#eaeae8] rounded-xl border dark:border-border border-[#ccc] p-4 focus-within:border-neutral-500 transition-colors">
                        <textarea
                            className="w-full bg-transparent text-sm resize-none focus:outline-none min-h-[80px] placeholder:text-muted-foreground"
                            placeholder="Tell us more (optional)"
                        />
                    </div>
                </div>

                <div className="h-px dark:bg-[#2C2C2E] bg-[#ccc] w-full my-8" />

                {/* Features Section */}
                <div className="mb-8">
                    <h3 className="text-[15px] font-medium mb-4 text-center text-foreground">What feature do you enjoy the most?</h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {featureTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleFeature(tag)}
                                className={`px-5 py-2 rounded-full text-[13px] border transition-colors ${selectedFeatures.includes(tag)
                                    ? "bg-blue-600/10 border-blue-600 text-blue-500"
                                    : "border-border bg-[#dfdfde] dark:bg-[#252527] text-muted-foreground dark:hover:bg-[#202022]"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-10">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-12 rounded-lg text-sm transition-colors w-[260px]">
                        Send Feedback
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RateUsContent;
