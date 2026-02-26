import Image from "next/image";

const VsCustomLogo = () => {
  return (
    <div className="flex items-center gap-x-2 justify-start ml-5">
      <Image src="/images/vs_logo.png" alt="logo" width={32} height={32} />
      {/* <p className="!font-[Ogonek Unicase] text-2xl">VillageSquare</p> */}
      <Image src="/images/VillageSquare.png" alt="VS-Logo" width={210} height={150} className="hidden md:block z-[1000]" />
    </div>
  );
};

export default VsCustomLogo; 
