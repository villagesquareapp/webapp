import { parseRichText } from "lib/richText";
import { useState } from "react";

export const VflixText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!text) return null;

  const MAX_LENGTH = 150; // VFlix usually has shorter visible area
  const needsTruncation = text.length > MAX_LENGTH;

  const displayText = isExpanded || !needsTruncation ? text : text.slice(0, MAX_LENGTH) + "...";

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div className="whitespace-pre-wrap text-sm text-white/90">
        {parseRichText(displayText)}
        {needsTruncation && (
          <span
            onClick={toggleExpand}
            className="text-gray-400 text-xs font-medium ml-1 cursor-pointer hover:underline"
            role="button"
          >
            {isExpanded ? " See less" : " See more"}
          </span>
        )}
      </div>
    </div>
  );
};

export default VflixText;
