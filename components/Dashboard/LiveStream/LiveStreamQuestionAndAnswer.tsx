import { VSChatAsk } from "components/icons/village-square";
import { Button } from "components/ui/button";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { IoMdShareAlt } from "react-icons/io";
import LiveStreamDialog from "./LiveStreamDialog";
import QuestionsAndAnswers from "./QuestionsAndAnswers";
import { useState } from "react";

const LiveStreamQuestionAndAnswer = () => {
  const [questionSent, setQuestionSent] = useState(false);
  const [showQuestionAndAnswer, setShowQuestionAndAnswer] = useState(false);
  const [question, setQuestion] = useState("");

  const handleSendQuestion = () => {
    if (question.trim()) {
      setQuestionSent(true);
      setShowQuestionAndAnswer(false);
    }
  };

  const handleOkayClick = () => {
    setQuestionSent(false);
    setShowQuestionAndAnswer(true);
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
        {showQuestionAndAnswer && (
          <div className="flex flex-col gap-y-2">
            <QuestionsAndAnswers />
            <div className="ml-[57px] flex flex-col gap-y-2">
              <div className="flex flex-row gap-x-2 items-center">
                <IoMdShareAlt className="size-6" />
                <p className="font-semibold text-sm">{"Reply (2)"}</p>
              </div>
              <QuestionsAndAnswers />
            </div>
          </div>
        )}
      </div>
    </LiveStreamDialog>
  );
};

export default LiveStreamQuestionAndAnswer;
