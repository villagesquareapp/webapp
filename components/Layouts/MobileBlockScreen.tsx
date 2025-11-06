"use client";

import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";

const MobileBlockScreen = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center mb-8">
            <svg
              className="w-48 h-48 text-primary animate-float"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="30"
                y="40"
                width="140"
                height="100"
                rx="8"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <rect
                x="40"
                y="50"
                width="120"
                height="70"
                fill="currentColor"
                opacity="0.2"
              />
              <line
                x1="100"
                y1="140"
                x2="100"
                y2="160"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="70"
                y1="160"
                x2="130"
                y2="160"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <circle
                cx="100"
                cy="85"
                r="25"
                fill="currentColor"
                opacity="0.9"
              />
              <path
                d="M90 85 L97 92 L110 79"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white">
              For Full Experience
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              VillageSquare works best on larger screens. Please switch to
              desktop view or use a computer for the full experience.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mt-8">
            <div className="flex items-start gap-3 text-left">
              <Monitor className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-sm">
                  How to enable Desktop View:
                </h3>
                <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
                  <li>Tap the menu button (⋮) in your browser</li>
                  <li>Look for "Desktop site" or "Request desktop site"</li>
                  <li>Toggle it ON</li>
                  <li>Refresh the page</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Optional: App Download CTA */}
          <div className="pt-6">
            <p className="text-sm text-gray-500">
              Or download our mobile app for a better experience
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileBlockScreen;
