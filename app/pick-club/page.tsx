"use client";
import Button from "@/library/components/atoms/Button";
import Card from "@/library/components/molecules/Card";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center gap-16 p-6 flex-1 overflow-scroll">
      <div className="flex flex-1 flex-col justify-center items-center gap-6 p-0">
        <p className="font-atyp text-[#02071E] text-[64px]/[5rem]">
          Pick your club
        </p>
        <Card className="flex-1 justify-between rounded-3xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="h-[100px] w-[100px] bg-gray-200 rounded-lg"></div>
            <div className="h-[100px] w-[100px] bg-gray-200 rounded-lg"></div>
            <div className="h-[100px] w-[100px] bg-gray-200 rounded-lg"></div>
            <div className="h-[100px] w-[100px] bg-gray-200 rounded-lg"></div>
            <div className="h-[100px] w-[100px] bg-gray-200 rounded-lg"></div>
            <div className="h-[100px] w-[100px] bg-gray-200 rounded-lg"></div>
          </div>

          <div className="flex justify-between font-outfit">
            <Button
              className="bg-transparent font-medium text-black shadow-none active:bg-transparent"
              text={"Cancel"}
              handleClick={() => router.push("/")}
            />
            <Button
              className="font-medium"
              text={"Launch Club"}
              handleClick={() => router.push("/swap-simulator")}
            />
          </div>
        </Card>
        <Card className="text-[#625F48]">
          <p className=" font-outfit font-semibold">Hint</p>
          <p className="max-w-[40ch] text-sm">
            Choose a club as a manager to experience the flow of the ticket
            process and simulate primary ticket sales and resales.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default page;
