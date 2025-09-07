import { ThemeProvider } from "components/ui/theme-provider";
import { Poppins, Albert_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import CustomToaster from "components/ui/custom/custom-toaster";
import { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-albert-sans",
});

export const metadata: Metadata = {
  title: `Village Square`,
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${poppins.variable} ${albertSans.variable}`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-[100dvh] overflow-x-hidden relative">{children}</div>
            <CustomToaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
