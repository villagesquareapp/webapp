"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "components/ui/skeleton";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSection {
    category: string;
    faqs: FAQItem[];
}

const FAQsContent = () => {
    const [sections, setSections] = useState<FAQSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [openItem, setOpenItem] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/app/faqs")
            .then((r) => r.json())
            .then((data) => {
                if (data?.status && Array.isArray(data.data)) {
                    setSections(data.data);
                    // Auto-open first question of first section
                    if (data.data[0]?.faqs?.length > 0) {
                        setOpenItem(`${data.data[0].category}-0`);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const toggle = (key: string) => {
        setOpenItem((prev) => (prev === key ? null : key));
    };

    return (
        <div className="max-w-[560px] pt-4 lg:pt-8 w-full mx-auto md:mx-0 pb-16">
            <h2 className="text-[22px] text-foreground font-semibold mb-1">
                Frequently asked questions
            </h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Discover answers to common inquiries about our platform, services and policies.
            </p>

            {loading ? (
                <div className="flex flex-col gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <Skeleton className="h-3 w-24 mb-1" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : sections.length === 0 ? (
                <p className="text-muted-foreground text-sm">No FAQs available at the moment.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {sections.map((section) => (
                        <div key={section.category}>
                            {/* Category label */}
                            <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                                {section.category}
                            </p>

                            {/* Questions */}
                            <div className="flex flex-col gap-2">
                                {section.faqs.map((item, i) => {
                                    const key = `${section.category}-${i}`;
                                    const isOpen = openItem === key;

                                    return (
                                        <div
                                            key={key}
                                            className={`rounded-xl border transition-colors ${
                                                isOpen
                                                    ? "bg-accent/40"
                                                    : "bg-accent/20 hover:bg-accent/30"
                                            }`}
                                        >
                                            <button
                                                onClick={() => toggle(key)}
                                                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                                            >
                                                <span className="text-[14px] font-medium text-muted-foreground pr-4">
                                                    {item.question}
                                                </span>
                                                {isOpen ? (
                                                    <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                                                ) : (
                                                    <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                                                )}
                                            </button>

                                            {isOpen && (
                                                <div className="px-4 pb-4">
                                                    <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-line">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FAQsContent;
