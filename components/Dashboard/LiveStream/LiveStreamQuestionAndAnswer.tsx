import { VSChatAsk } from "components/icons/village-square";
import { Button } from "components/ui/button";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { IoMdShareAlt } from "react-icons/io";
import LiveStreamDialog from "./LiveStreamDialog";
import QuestionsAndAnswers from "./QuestionsAndAnswers";
import { useState } from "react";
import { toast } from "sonner";

interface LiveStreamQuestionAndAnswerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  streamData?: any;
  user: IUser;
  websocketRef: React.MutableRefObject<WebSocket | null>;
}

const LiveStreamQuestionAndAnswer = ({ open, onOpenChange, streamData, user, websocketRef }: LiveStreamQuestionAndAnswerProps) => {
  const [questionSent, setQuestionSent] = useState(false);
  const [showQuestionAndAnswer, setShowQuestionAndAnswer] = useState(false);
  const [question, setQuestion] = useState("");

  const handleSendQuestion = () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      toast.error("Not connected to livestream. Please refresh.");
      return;
    }

    const questionMessage = {
      action: "publish",
      event: "livestream-questions",
      channelId: streamData?.livestream_room_id,
      // questionId: crypto.randomUUID(),
      user: {
        id: user.uuid,
        name: user.name,
        profile_picture: user.profile_picture || "/images/vs-logo.webp",
      },
      question: question.trim(),
    };

    console.log("Sending question:", questionMessage);
    console.log("WebSocket state:", websocketRef.current.readyState);
    
    try {
      websocketRef.current.send(JSON.stringify(questionMessage));
      setQuestionSent(true);
      setShowQuestionAndAnswer(false);
      console.log("Question sent successfully!");
    } catch (error) {
      console.error("Error sending question:", error);
      toast.error("Failed to send question");
    }
  };

  const handleOkayClick = () => {
    setQuestionSent(false);
    setShowQuestionAndAnswer(false);
    setQuestion("");
  };

  const handleAskQuestion = () => {
    setShowQuestionAndAnswer(false);
    setQuestionSent(false);
    setQuestion("");
  };

  const handleDialogOpen = () => {
    setShowQuestionAndAnswer(false);
    setQuestionSent(false);
    setQuestion("");
  };

  return (
    <LiveStreamDialog
      contentClassName={`${questionSent ? "w-[420px] h-[420px]" : "max-w-[650px]"} ${
        showQuestionAndAnswer ? "h-[500px]" : "h-fit"
      }`}
      trigger={
        <div
          className="bg-white/10 rounded-full flex size-10 place-content-center items-center relative cursor-pointer"
          onClick={handleDialogOpen}
        >
          <GoDotFill className="size-5 absolute top-0 -right-1.5 text-red-600" />
          <VSChatAsk className="size-7 flex -mb-1 -mr-1" />
        </div>
      }
      open={open}
      onOpenChange={onOpenChange}
      title={!questionSent || showQuestionAndAnswer ? "Question & Answer" : ""}
      footer={
        showQuestionAndAnswer ? (
          <Button className="text-foreground" size={"lg"} onClick={handleAskQuestion}>
            Ask a Question
          </Button>
        ) : !questionSent && !showQuestionAndAnswer ? (
          <Button
            className="text-foreground"
            size={"lg"}
            onClick={handleSendQuestion}
            disabled={!question.trim()}
          >
            Send
          </Button>
        ) : (
          <span
            className="font-semibold text-center -mb-3 cursor-pointer"
            onClick={handleOkayClick}
          >
            Okay
          </span>
        )
      }
    >
      <div
        className={`h-full ${showQuestionAndAnswer ? "overflow-y-auto" : "overflow-y-hidden"}`}
      >
        {!questionSent && !showQuestionAndAnswer && (
          <textarea
            placeholder="Ask something..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="h-80 !outline-none !border-none !ring-0 w-full p-4 resize-none rounded-xl bg-accent"
          />
        )}
        {questionSent && (
          <div className="flex flex-col gap-y-4 place-items-center text-center">
            <Image
              src={"/images/successful-check.png"}
              alt="question-and-answer"
              width={150}
              height={150}
            />
            <p className="text-center font-semibold">Question Sent Successfully</p>
            <p>Your question has been sent to the host. Please wait for their response.</p>
          </div>
        )}
      </div>
    </LiveStreamDialog>
  );
};

export default LiveStreamQuestionAndAnswer;
