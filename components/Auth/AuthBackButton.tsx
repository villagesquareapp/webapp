"use client";

import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const AuthBackButton = () => {
  const router = useRouter();

  return (
    <IoIosArrowBack onClick={() => router.back()} className="fixed size-8 top-8 left-8" />
  );
};

export default AuthBackButton;
