import RightSidebar from "../RightSidebar";

const SocialMainWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row justify-end lg:pr-10 w-full h-full relative">
      <div className="flex-1 w-full max-w-[750px] border-r border-white/10 min-h-screen px-4 lg:pl-10 lg:pr-10 pt-4 pb-8">
        {children}
      </div>
      <div className="hidden lg:block w-[400px] shrink-0 pl-6 lg:pl-10 pt-4 mr-10">
        <RightSidebar />
      </div>
    </div>
  );
};

export default SocialMainWrapper;
