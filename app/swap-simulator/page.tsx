"use client";
import PrimaryTicketMarket from "@/library/components/organisms/PrimaryTicketMarket";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/library/components/organisms/Resizable";
import SecondaryTicketMarket from "@/library/components/organisms/SecondaryTicketMarket";
import SecondaryTicketMarketAnalytics from "@/library/components/organisms/SecondaryTicketMarketAnalytics";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-16 p-0 flex-1 overflow-scroll">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={35}>
          <PrimaryTicketMarket />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={65}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={30}>
              <SecondaryTicketMarketAnalytics />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={70}>
              <SecondaryTicketMarket />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default page;
