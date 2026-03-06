"use client";

import Image from "next/image";
import { useSidebar } from "components/ui/sidebar";

const VsCustomLogo = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className={`flex items-center gap-x-2 ${isCollapsed ? 'justify-center ml-0' : 'justify-start ml-5'}`}>
      <Image src="/images/vs_logo.png" alt="logo" width={32} height={32} />
      {/* <p className="!font-[Ogonek Unicase] text-2xl">VillageSquare</p> */}
      {!isCollapsed && (
        <Image src="/images/VillageSquare.png" alt="VS-Logo" width={210} height={150} className="hidden md:block z-[1000]" />
      )}
    </div>
  );
};

export default VsCustomLogo; 
