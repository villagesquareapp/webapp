'use client';

import CustomToaster from "components/ui/custom/custom-toaster";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/tac" },
    { name: "EULA FOR VILLAGESQUARE", path: "/eula" },
    { name: "Disclaimer for VILLAGESQUARE", path: "/disclaimer" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  const params = useParams();
  const localePrefix = params?.locale ? `/${params.locale}` : "en";

  return (
    <div className="min-h-[100dvh] relative">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src="/images/login_bg_clip.png"
          alt="bg-clip"
          fill
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container relative min-h-[95dvh] flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col p-10 lg:flex">
          <div className="flex flex-col items-center justify-center gap-y-3 my-auto h-[400px] ml-[70px]">
            <Image
              src="/images/vs_logo.png"
              alt="VS-Logo"
              width={150}
              height={150}
            />
            <div className="flex flex-col items-start justify-center mt-2">
              {/* <p className="font-ogonek font-black text-[55px] tracking-tight">
                Villagesquare
              </p> */}
              <Image src="/images/VillageSquare.png" alt="VS-Logo" width={320} height={150} />
              <p className="font-poppins text-[23px] mt-2">
                Where Connections Flourish.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:p-8 w-full">
          <div className="flex w-full flex-col justify-center space-y-4 lg:w-[450px] sm:w-[350px] px-8 sm:px-0">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <Image
                src="/images/vs_logo.png"
                alt="VS-Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            {children}
          </div>
        </div>
      </div>

      <CustomToaster />

      <footer className="relative z-20 flex justify-center items-center py-8 px-4 text-sm text-gray-400 md:max-w-7xl mx-auto -mt-12 flex-wrap gap-y-2">
        {footerLinks.map((link, index) => (
          <React.Fragment key={index}>
            <Link
              href={`/${localePrefix}${link.path}`}
              className="text-sm text-gray-500 hover:text-gray-700 mx-2 font-bold"
              target='_blank' 
            >
              {link.name}
            </Link>
          </React.Fragment>
        ))}
      </footer>

      <style jsx>{`
        @media (max-width: 768px) {
          .store-buttons {
            margin-top: 0.5rem;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
