import RightSidebar from "../RightSidebar";

const SocialMainWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row justify-end lg:pr-6 w-full h-full relative">
      <div className="flex-1 border-r border-white/10 min-h-screen px-4 lg:px-6 pt-4 pb-8">
        {children}
      </div>
      <div className="hidden lg:block w-[420px] shrink-0 pl-4 lg:pl-6 pt-4 mr-0 lg:pr-16 pr-8">
        <RightSidebar />
      </div>
    </div>
  );
};

export default SocialMainWrapper;
