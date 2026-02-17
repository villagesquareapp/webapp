import Link from "next/link";
import React from "react";

export const parseRichText = (text: string) => {
    if (!text) return null;

    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
        const match = part.match(/^([#@])([\w\d_]+)(.*)/);

        if (match) {
            const symbol = match[1];
            const content = match[2];
            const punctuation = match[3];

            const isHashtag = symbol === "#";
            const linkHref = isHashtag
                ? `/search?q=%23${content}`
                : `/${content}`;

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
