import { parseRichText } from "lib/richText";
import { useState } from "react";

export const PostText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!text) return null;

  // Truncate at 250 characters
  const MAX_LENGTH = 200;
  const needsTruncation = text.length > MAX_LENGTH;

  const displayText = isExpanded || !needsTruncation ? text : text.slice(0, MAX_LENGTH) + "...";

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent onClick handlers
    e.preventDefault(); // Prevent default behavior
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="px-4">
      <div className="whitespace-pre-wrap font-normal text-[15px] text-white/90">
        {parseRichText(displayText)}
        {needsTruncation && (
          <span
            onClick={toggleExpand}
            className="text-gray-400 text-sm font-medium ml-1 cursor-pointer hover:underline"
            role="button"
          >
            {isExpanded ? " See less" : " See more"}
          </span>
        )}
      </div>
    </div>
  );
};

export default PostText;
