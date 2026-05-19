"use client";

import Image from "next/image";
import { useSidebar } from "components/ui/sidebar";
import { useTheme } from "next-themes";
import Link from "next/link";

const VsCustomLogo = () => {
  const { state, isMobile } = useSidebar();
  const { resolvedTheme } = useTheme();
  const isCollapsed = state === "collapsed" && !isMobile;

  const logoSrc = resolvedTheme === "light" ? "/images/VillageSquare-ash.png" : "/images/VillageSquare.png";

  return (
    <div className={`flex items-center gap-x-2 justify-start ml-5`}>
      <Link href="/home">
        <img src="/images/vs_logo.png" alt="logo" width={32} height={32} className="shrink-0" />
      </Link>
      {/* <p className="!font-[Ogonek Unicase] text-2xl">VillageSquare</p> */}
      {!isCollapsed && (
        <Link href="/home">
          <img key={logoSrc} src={logoSrc} alt="VS-Logo" className="w-[160px] md:w-[180px] h-auto z-[1000] shrink-0 object-contain" />
        </Link>
      )}
    </div>
  );
};

export default VsCustomLogo; 
