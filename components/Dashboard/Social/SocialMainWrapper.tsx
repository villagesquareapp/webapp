"use client";

import RightSidebar from "../RightSidebar";
import { TbPencilPlus } from "react-icons/tb";
import { useAddPost } from "context/AddPostContext";

const SocialMainWrapper = ({ children }: { children: React.ReactNode }) => {
  const { openAddPost } = useAddPost();

  return (
    <div className="flex flex-row w-full h-full relative overflow-hidden">
      <div
        id="social-main-scroll"
        className="flex-1 w-full lg:max-w-[64rem] border-r border-border h-full overflow-y-auto px-4 lg:px-6 pt-4 pb-8 no-scrollbar shrink-0"
      >
        {children}

        {/* Mobile FAB */}
        <button
          onClick={openAddPost}
          className="md:hidden fixed bottom-24 right-5 bg-primary text-primary-foreground size-14 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center z-50 hover:scale-105 active:scale-95 transition-all"
        >
          <TbPencilPlus size={26} />
        </button>
      </div>
      <div className="hidden lg:block lg:w-[24rem] pt-4 px-4 lg:pl-6 lg:pr-12 h-full overflow-hidden shrink-0">
        <RightSidebar />
      </div>
    </div>
  );
};

export default SocialMainWrapper;
