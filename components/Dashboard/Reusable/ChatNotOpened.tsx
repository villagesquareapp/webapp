import Image from "next/image";
import { ReactNode } from "react";

const ChatNotOpened = ({ title, content }: { title?: string; content: ReactNode }) => {
  return (
    <div className="flex flex-col gap-y-3 w-full place-items-center m-auto">
      <Image src="/images/interaction.png" alt="Start Chatting" width={150} height={150} />
      <div className="flex flex-col gap-y-2 place-items-center">
        {title && <p className="text-sm font-bold">{title}</p>}
        {content && <p className="text-sm text-center text-muted-foreground">{content}</p>}
      </div>o
    </div>
  );
};

export default ChatNotOpened;
