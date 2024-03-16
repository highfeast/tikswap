import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-16 p-0 flex-1 overflow-scroll">
      <div className="flex flex-col justify-center items-center gap-2 p-0">
        <p className="font-atyp text-[64px] text-[#02071E]">
          Enter your fan zone
        </p>
        <p className="font-medium text-sm leading-[17px] text-[#484E62]">
          TikSwap empowers fans to reclaim the ticketing process. Click the
          power button to discover how.
        </p>
      </div>
      <Link
        className="w-[136px] h-[136px] flex bg-transparent items-center justify-center rounded-full border-[6px] border-solid border-[#34C759]"
        href={"/pick-club"}
      >
        <img src="/Standby.svg" alt="standby image" />
      </Link>
    </div>
  );
};

export default page;
