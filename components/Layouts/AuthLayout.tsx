import CustomToaster from "components/ui/custom-toaster";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] relative">
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src="/images/login_bg_clip.png"
          alt="Authentication"
          fill
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container relative min-h-[100dvh] flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col p-10 dark:border-r lg:flex">
          <div className="flex flex-col items-center justify-center  gap-y-3 my-auto h-[400px]">
            <Image src="/images/vs_logo.png" alt="Logo" width={150} height={150} />
            <div className="flex flex-col items-center justify-center gap-y-1">
              <p className="font-[Ogonek Unicase] font-black text-4xl">VillageSquare</p>
              <p className="font-poppins">Where Connections Flourish.</p>
            </div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-5 lg:w-[420px] sm:w-[350px]">
            {children}
          </div>
        </div>
      </div>
      <CustomToaster />
    </div>
  );
}
