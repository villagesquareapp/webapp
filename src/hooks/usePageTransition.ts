"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return { isTransitioning };
};
