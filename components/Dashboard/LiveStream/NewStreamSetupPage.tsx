"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LivePreview from "./LivePreview";

const NewStreamSetupPage = () => {
  const router = useRouter();
  const [livestreamData, setLivestreamData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedData = localStorage.getItem("pending_livestream");
    if (storedData) {
      setLivestreamData(JSON.parse(storedData));
    } else {
      router.push("/livestream");
    }
  }, [router]);

  if (!isClient || !livestreamData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin size-8 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    );
  }

  return <LivePreview livestreamData={livestreamData} />;
};

export default NewStreamSetupPage;
