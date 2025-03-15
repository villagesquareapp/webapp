import { useState } from "react";

export const PostText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderTextWithHashtags = (text: string) => {
    const words = text.split(" ");
    return words.map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <span key={index} className="text-primary">
            {word}{" "}
          </span>
        );
      }
      return word + " ";
    });
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent onClick handlers
    e.preventDefault(); // Prevent default behavior
    setIsExpanded(!isExpanded);
  };

  // Check if text is long enough to need truncation
  // Rough estimate: average line has ~50-60 chars, so 6 lines ≈ 300-360 chars
  const needsTruncation = text.length > 300;

  return (
    <div className="px-4">
      <div
        className={`whitespace-pre-line ${
          !isExpanded && needsTruncation ? "line-clamp-6" : ""
        }`}
      >
        {renderTextWithHashtags(text)}
      </div>

      {needsTruncation && (
        <button
          onClick={toggleExpand}
          className="text-primary text-sm font-medium mt-1 hover:underline"
          aria-label={isExpanded ? "Show less text" : "See more text"}
        >
          {isExpanded ? "Show less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default PostText;
