import Link from "next/link";
import React from "react";

export const parseRichText = (text: string, mentions?: IMention[]) => {
    if (!text) return null;

    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
        const match = part.match(/^([#@])([\w\d_]+)(.*)/);

        if (match) {
            const symbol = match[1];
            const content = match[2];
            const punctuation = match[3];

            const isHashtag = symbol === "#";

            let linkHref: string;
            if (isHashtag) {
                linkHref = `/search?q=%23${content}`;
            } else {
                // Look up the UUID from the mentions array
                const mention = mentions?.find(
                    (m) => m.username.toLowerCase() === content.toLowerCase()
                );
                linkHref = mention
                    ? `/${content}?uid=${mention.uuid}`
                    : `/${content}`;
            }

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

