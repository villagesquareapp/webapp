import { useEffect, useRef, ChangeEvent } from "react";
import { VSSend } from "components/icons/village-square";
import CustomAvatar from "components/ui/custom/custom-avatar";
import { IoClose } from "react-icons/io5";
import { MdAttachFile } from "react-icons/md";

const Message = ({ messageType }: { messageType: "me" | "other" }) => {
  return (
    <div className="flex flex-col gap-y-2 m-2">
      <p
        className={`text-sm px-3 py-2 ${
          messageType === "me"
            ? "rounded-tr-none bg-primary ml-auto"
            : "rounded-tl-none bg-accent"
        } rounded-2xl w-fit max-w-[75%]`}
      >
        Hello how are you?how are you?how are you?how are you?how are you?how are you?
      </p>
      <p className={`text-xs text-muted-foreground ${messageType === "me" && "ml-auto"} px-3`}>
        09:30
      </p>
    </div>
  );
};

const Chat = ({ removeSelectedChat }: { removeSelectedChat: () => void }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate new height
    const newHeight = Math.min(textarea.scrollHeight, 100);
    textarea.style.height = `${newHeight}px`;
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    adjustTextareaHeight();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []); // Scroll to bottom when chat opens

  return (
    <div className="fixed bottom-0 z-50 flex flex-col border rounded-t-2xl right-[350px] w-[320px] bg-background shadow-md animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between py-2 px-3 cursor-pointer">
        <div className="flex flex-row items-center gap-x-2">
          <CustomAvatar
            src="https://github.com/shadcn.png"
            name="CN"
            className="size-[56px] border-foreground border"
          />
          <p>Micheal Jordan</p>
        </div>
        <IoClose className="size-6" onClick={removeSelectedChat} />
      </div>
      <div className="h-[350px] flex flex-col px-3 overflow-y-auto scroll-smooth">
        <p className="text-sm text-muted-foreground px-4 text-center">Today</p>
        <Message messageType="other" />
        <Message messageType="other" />
        <Message messageType="me" />
        <Message messageType="me" />
        <Message messageType="me" />
        <Message messageType="other" />
        <Message messageType="other" />
        <Message messageType="me" />
        <Message messageType="me" />
        <Message messageType="me" />
        <Message messageType="me" />
        <Message messageType="other" />
        <Message messageType="me" />
        <Message messageType="other" />
        <Message messageType="me" />
        <Message messageType="me" />
        <Message messageType="me" />
        <Message messageType="me" />
        <Message messageType="me" />
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 bg-background py-1.5">
        <div className="flex px-3">
          <div className="bg-secondary border border-white/15 rounded-md min-h-[40px] h-fit max-h-[100px] flex flex-row items-center py-1 justify-center w-full px-2">
            <div className="border-r h-[35px] pr-2 flex border-white/15 items-center">
              <div className="relative size-fit">
                <input type="file" className="inset-0 absolute opacity-0 z-10" />
                <MdAttachFile className="size-5" />
              </div>
            </div>
            <textarea
              ref={textareaRef}
              placeholder="Type a message..."
              onChange={handleTextareaChange}
              rows={1}
              className="px-2 text-sm bg-transparent pt-1 min-h-[30px] outline-none resize-none w-full overflow-y-auto scrollbar-hide"
            />
            <VSSend className="size-8 ml-2 mr-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
