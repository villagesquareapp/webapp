import RightSidebar from "../RightSidebar";

const SocialMainWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row w-full h-full relative overflow-hidden">
      <div
        id="social-main-scroll"
        className="flex-1 w-full lg:max-w-[64rem] border-r border-border h-full overflow-y-auto px-4 lg:px-6 pt-4 pb-8 no-scrollbar shrink-0"
      >
        {children}
      </div>
      <div className="hidden lg:block lg:w-[24rem] pt-4 px-4 lg:pl-6 lg:pr-12 h-full overflow-hidden shrink-0">
        <RightSidebar />
      </div>
    </div>
  );
};

export default SocialMainWrapper;
