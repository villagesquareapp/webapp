import { parseRichText } from "lib/richText";
import { useState } from "react";

export const PostText = ({ text, mentions }: { text: string; mentions?: IMention[] }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!text) return null;

  // Truncate at 250 characters
  const MAX_LENGTH = 200;
  const needsTruncation = text.length > MAX_LENGTH;

  const displayText = isExpanded || !needsTruncation ? text : text.slice(0, MAX_LENGTH) + "...";

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div className="whitespace-pre-wrap font-normal text-[15px] text-foreground">
        {parseRichText(displayText, mentions)}
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

