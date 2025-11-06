import CustomToaster from "components/ui/custom/custom-toaster";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "EULA FOR VILLAGESQUARE", href: "/eula" },
    { name: "Disclaimer for VILLAGESQUARE", href: "/disclaimer" },
    { name: "Contact Us", href: "/contact-us" },
  ];
  return (
    <div className="min-h-[100dvh] relative">
      {/* @Todo Add arrow back button to the top left of forgot password and the other one*/}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src="/images/login_bg_clip.png"
          alt="Authentication"
          fill
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container relative min-h-[100dvh] flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col p-10 lg:flex">
          <div className="flex flex-col items-center justify-center gap-y-3 my-auto h-[400px] ml-[70px]">
            <Image
              src="/images/vs_logo.png"
              alt="VS-Logo"
              width={150}
              height={150}
            />
            <div className="flex flex-col items-start justify-center">
              <p className="font-ogonek font-black text-[55px] tracking-tight">
                Villagesquare
              </p>
              <p className="font-poppins text-[23px]">
                Where Connections Flourish.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="flex w-full flex-col justify-center space-y-4 lg:w-[450px] sm:w-[350px]">
            {children}
          </div>
        </div>
      </div>
      <CustomToaster />
      <footer className="relative z-20 flex justify-center items-center py-8 px-4 text-sm text-gray-400 max-w-7xl mx-auto -mt-16 flex-wrap">
        {footerLinks.map((link, index) => (
          <React.Fragment key={index}>
            <Link
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-700 mx-2 font-bold"
            >
              {link.name}
            </Link>
          </React.Fragment>
        ))}
      </footer>
    </div>
  );
}
