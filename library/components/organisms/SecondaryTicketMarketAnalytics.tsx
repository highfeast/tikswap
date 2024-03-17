import Card from "../molecules/Card";

const SecondaryTicketMarketAnalytics = () => {
  return (
    <div className="flex flex-col h-full p-4 overflow-scroll min-w-fit  gap-4">
      <p className=" font-outfit font-semibold w-full gap-4">
        Secondary Market Analytics
      </p>
      <div className="flex flex-wrap gap-4">
        <Card className="min-w-80 w-fit flex-row justify-between">
          <div className="flex flex-col gap-6">
            <p className=" font-outfit font-semibold text-[#484E62]">
              Tickets Sold
            </p>
            <p className="text-4xl font-outfit font-bold text-[#02071E]">
              2.2k
            </p>
          </div>
        </Card>

        {/* <Card className="min-w-80 w-fit flex-row justify-between">
          <div className="flex flex-col gap-6">
            <p className=" font-outfit font-semibold text-[#484E62]">Note</p>
            <p className="text-4xl font-outfit font-bold text-[#02071E]">
              2.2k
            </p>
          </div>
          <p className="font-atyp text-sm text-[#34C759] font-bold">ready</p>
        </Card>

        <Card className="min-w-80 w-fit flex-row justify-between">
          <div className="flex flex-col gap-6">
            <p className=" font-outfit font-semibold text-[#484E62]">Note</p>
            <p className="text-4xl font-outfit font-bold text-[#02071E]">
              2.2k
            </p>
          </div>
          <p className="font-atyp text-sm text-[#34C759] font-bold">ready</p>
        </Card> */}

        {/* TODO: button */}
        <Card className="w-80 flex-row items-center justify-center bg-black">
          <p className="font-atyp text-2xl font-bold text-white">
            Get Fan Tokens ↗
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SecondaryTicketMarketAnalytics;
