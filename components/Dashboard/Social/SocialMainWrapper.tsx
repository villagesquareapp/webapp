import RightSidebar from "../RightSidebar";

const SocialMainWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row w-full h-full relative overflow-hidden">
      <div
        id="social-main-scroll"
        className="w-full lg:w-[650px] shrink-0 border-r border-white/5 h-full overflow-y-auto px-4 lg:px-6 pt-4 pb-8 no-scrollbar"
      >
        {children}
      </div>
      <div className="hidden lg:block flex-1 pt-4 px-4 lg:px-6 h-full overflow-hidden">
        <div className="w-[350px] h-full">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default SocialMainWrapper;
