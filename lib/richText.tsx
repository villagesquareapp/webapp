import Link from "next/link";
import React from "react";

export const parseRichText = (text: string) => {
    if (!text) return null;

    // Regex to match hashtags (#word) and mentions (@username)
    // We want to capture the leading space or start of string to avoid matching inside words
    // But strictly, we can split by space/newlines and check each word
    // A better regex approach handles punctuation:
    // ([\s\n]|^)([@#][\w\d_]+)(?=[\s\n.,!?;:]|$)

    // Simple word-based parsing often fails on punctuation (e.g. "hello #world!")
    // Let's split by delimiters but keep them? 
    // Easier: Split by space/newline, then check if word starts with #/@ and handle trailing punctuation

    const parts = text.split(/(\s+)/); // Split by whitespace, keeping delimiters

    return parts.map((part, index) => {
        // Check if the part mimics a hashtag or mention
        // We trim punctuation from the end for the link, but display it

        // Regex for exact match of "starting with # or @"
        const match = part.match(/^([#@])([\w\d_]+)(.*)/);

        if (match) {
            const symbol = match[1];
            const content = match[2];
            const punctuation = match[3]; // Trailing chars like "!" or "."

            const isHashtag = symbol === "#";
            const linkHref = isHashtag
                ? `/search?q=%23${content}`
                : `/${content}`; // Profile link

            return (
                <React.Fragment key={index}>
                    <Link
                        href={linkHref}
                        className="text-blue-500 hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {symbol}{content}
                    </Link>
                    {punctuation}
                </React.Fragment>
            );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};
