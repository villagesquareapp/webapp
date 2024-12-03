"use client";

import * as React from "react";

interface ReplyTextareaProps {
  replyingTo?: IPostComment | null;
  onCancelReply?: () => void;
  content?: string;
  onChangeContentAction: (content: string) => void;
  className?: string;
}

export default function ReplyTextArea({
  replyingTo,
  onCancelReply,
  content = "",
  onChangeContentAction,
  className = "",
}: ReplyTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const displayRef = React.useRef<HTMLDivElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeContentAction(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Backspace" && !content && replyingTo?.user.username) {
      e.preventDefault();
      onCancelReply?.();
    }
  };

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [replyingTo]);

  React.useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [content]);

  /**
   * @Todo Fix text highlight and scroll
   */

  return (
    <div className={`relative ${className}`}>
      <div
        ref={displayRef}
        className="min-h-[62px] max-h-[200px] overflow-y-auto w-full px-4 py-2 bg-accent rounded-xl text-sm"
        style={{ wordBreak: "break-word" }}
      >
        {replyingTo && (
          <span
            onClick={() => onCancelReply?.()}
            className="bg-black text-muted-foreground px-2 rounded-sm py-0.5 mr-1 cursor-pointer hover:bg-accent-foreground transition-colors"
          >
            Replying to{" "}
            <span className="font-semibold text-foreground">{replyingTo.user.username}</span>
          </span>
        )}
        {content}
        {!content && !replyingTo && (
          <span className="text-muted-foreground">Add comment...</span>
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="absolute top-0 left-0 w-full h-full opacity-0 resize-none"
        style={{ caretColor: "transparent" }}
      />
    </div>
  );
}
