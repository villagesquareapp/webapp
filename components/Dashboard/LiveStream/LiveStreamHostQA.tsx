"use client";

import { useEffect, useState } from "react";
import LiveStreamDialog from "./LiveStreamDialog";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { Button } from "components/ui/button";
import { VSChatAsk } from "components/icons/village-square";
import { FaArrowLeft } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { getLivestreamQuestions } from "api/livestreams";
import { toast } from "sonner";

interface Question {
  questionId: string;
  question: string;
  user: {
    name: string;
    profile_picture: string;
    username: string;
    userId: string;
  };
  answers?: any[];
}

interface LiveStreamHostQAProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  streamData?: any;
  onSendAnswer: (questionId: string, answer: string) => void;
  hasUnreadQuestions?: boolean;
  newQuestions?: Question[];
}

const LiveStreamHostQA = ({
  open,
  onOpenChange,
  streamData,
  onSendAnswer,
  hasUnreadQuestions = false,
  newQuestions = [],
}: LiveStreamHostQAProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [replyText, setReplyText] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open && streamData?.uuid) {
      fetchQuestions();
    }
  }, [open]);

  useEffect(() => {
    if (newQuestions.length > 0) {
      setQuestions((prev) => {
        const existingIds = new Set(prev.map((q) => q.questionId));
        const uniqueNewQuestions = newQuestions.filter(
          (q) => !existingIds.has(q.questionId)
        );
        if (uniqueNewQuestions.length === 0) {
          return prev;
        }
        return [...prev, ...uniqueNewQuestions];
      });
    }
  }, [newQuestions.length]);

  const fetchQuestions = async () => {
    if (!streamData?.uuid) {
      console.error("No stream UUID available");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching questions for stream:", streamData.uuid);
      const response = await getLivestreamQuestions(streamData.uuid);

      console.log("Questions API response:", response);

      if (response.status && response.data) {
        console.log("Fetched questions:", response.data);
        setQuestions(Array.isArray(response.data) ? response.data : []);
      } else {
        console.warn("No questions data in response");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions");
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyClick = (question: Question) => {
    setSelectedQuestion(question);
    setReplyText("");
  };

  const handleBackToQuestions = () => {
    setSelectedQuestion(null);
    setReplyText("");
  };

  const handleSendReply = () => {
    if (replyText.trim() && selectedQuestion) {
      onSendAnswer(selectedQuestion.questionId, replyText);

      // Update local state with the answer
      setQuestions((prev) =>
        prev.map((q) =>
          q.questionId === selectedQuestion.questionId
            ? { 
                ...q, 
                answers: [
                  ...(q.answers || []),
                  {
                    answer: replyText,
                    user: {
                      id: streamData?.host?.uuid,
                      name: streamData?.host?.name || "Host",
                      profile_picture: streamData?.host?.profile_picture || "/images/vs-logo.webp",
                    }
                  }
                ] 
              }
            : q
        )
      );

      setSelectedQuestion(null);
      setReplyText("");
    }
  };

  const handleDialogClose = () => {
    setSelectedQuestion(null);
    setReplyText("");
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  // Count unanswered questions
    const unansweredCount = questions.filter((q) => !q.answers || q.answers.length === 0).length;

  return (
    <LiveStreamDialog
      contentClassName="max-w-[650px] h-[600px]"
      trigger={
        <div className="relative">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="p-2 w-8 h-8 relative"
          >
            <VSChatAsk className="size-4" />
            {hasUnreadQuestions && (
              <GoDotFill className="size-5 absolute -top-1 -right-1 text-red-600" />
            )}
          </Button>
        </div>
      }
      open={open}
      onOpenChange={handleDialogClose}
      title={
        selectedQuestion
          ? "Reply to Question"
          : `Questions & Answers (${questions.length})`
      }
      backIcon={
        selectedQuestion ? (
          <FaArrowLeft
            className="size-5 cursor-pointer"
            onClick={handleBackToQuestions}
          />
        ) : null
      }
      footer={
        selectedQuestion ? (
          <Button
            className="text-foreground w-full"
            size="lg"
            onClick={handleSendReply}
            disabled={!replyText.trim()}
          >
            Send
          </Button>
        ) : null
      }
    >
      <div className="h-full flex flex-col">
        {!selectedQuestion ? (
          // Questions List View
          <div className="flex-1 overflow-y-auto space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <VSChatAsk className="size-12 mb-4 opacity-50" />
                <p className="font-semibold">No questions yet</p>
                <p className="text-sm">
                  Questions from viewers will appear here
                </p>
              </div>
            ) : (
              questions.map((question, index) => (
                <div key={index} className="flex flex-col gap-y-3">
                  {/* Question */}
                  <div className="flex items-start gap-x-3">
                    <CustomAvatar
                      src={question.user.profile_picture}
                      className="size-12 shrink-0"
                      name={question.user?.name}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">
                        {question.user?.name}
                      </p>
                      <p className="text-sm">{question.question}</p>
                      {!question.answers ||
                        (question.answers.length === 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 px-0 text-blue-600 hover:text-blue-700 hover:bg-transparent"
                            onClick={() => handleReplyClick(question)}
                          >
                            ↩ Reply
                          </Button>
                        ))}
                    </div>
                  </div>

                  {/* Answer (if exists) */}
                  {question.answers && question.answers.length > 0 && (
                    <div className="ml-[57px] flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-2">
                        <p className="font-semibold text-sm text-muted-foreground">
                          Reply ({question.answers.length})
                        </p>
                      </div>
                      {question.answers.map((ans: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-x-3">
                          <CustomAvatar
                            src={ans.user.profile_picture || "/images/vs-logo.webp"}
                            className="size-12 shrink-0"
                            name={ans.user.name || "User"}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">
                              {ans.user.name || "User"}
                            </p>
                            <p className="text-sm">{ans.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          // Reply View
          <div className="flex flex-col gap-y-4 h-full">
            {/* Question being replied to */}
            <div className="flex items-start gap-x-3 p-4 bg-accent rounded-lg">
              <CustomAvatar
                src={selectedQuestion.user.profile_picture}
                className="size-12 shrink-0"
                name={selectedQuestion.user.name}
              />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">
                  {selectedQuestion.user.name}
                </p>
                <p className="text-sm">{selectedQuestion.question}</p>
              </div>
            </div>

            {/* Reply textarea */}
            <div className="flex-1">
              <textarea
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full h-full p-4 resize-none rounded-lg bg-accent !outline-none !border-none !ring-0"
              />
            </div>
          </div>
        )}
      </div>
    </LiveStreamDialog>
  );
};

export default LiveStreamHostQA;
