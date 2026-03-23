"use client";

import Image from "next/image";
import { useSidebar } from "components/ui/sidebar";
import { useTheme } from "next-themes";

const VsCustomLogo = () => {
  const { state } = useSidebar();
  const { resolvedTheme } = useTheme();
  const isCollapsed = state === "collapsed";

  const logoSrc = resolvedTheme === "light" ? "/images/VillageSquare-ash.png" : "/images/VillageSquare.png";

  return (
    <div className={`flex items-center gap-x-2 justify-start ml-5`}>
      <img src="/images/vs_logo.png" alt="logo" width={32} height={32} className="shrink-0" />
      {/* <p className="!font-[Ogonek Unicase] text-2xl">VillageSquare</p> */}
      {!isCollapsed && (
        <img key={logoSrc} src={logoSrc} alt="VS-Logo" className="hidden md:block w-[210px] h-auto z-[1000] shrink-0 object-contain" />
      )}
    </div>
  );
};

export default VsCustomLogo; 
