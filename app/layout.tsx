import LayoutWrapper from "@/library/components/template/LayoutWrapper";
import "@/library/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TikSwap",
  description:
    "TikSwap empowers fans to reclaim the ticketing process. Come discover how.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
