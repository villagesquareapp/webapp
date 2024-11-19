import { ThemeProvider } from "components/ui/theme-provider";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import CustomToaster from "components/ui/custom-toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${poppins.variable}`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <CustomToaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
