"use client";
import { Inter, Outfit } from "next/font/google";
import localFont from "next/font/local";

import RootProvider from "@/library/providers/provider";
import { cn } from "@/library/utils";
import WrapAround from "./WrapAround";
import { Toaster } from "../atoms/sonner";

const inter = Inter({ subsets: ["latin"], preload: true });
const outfit = Outfit({
  subsets: ["latin"],
  preload: true,
  variable: "--font-outfit",
});

const atyp = localFont({
  src: [
    {
      path: "../../../public/AtypDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/AtypDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/AtypDisplay-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-atyp",
  preload: true,
});

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={cn(inter.className, outfit.variable, atyp.variable)}>
        <main>
          <RootProvider>
            <WrapAround>{children}</WrapAround>
          </RootProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
};

export default LayoutWrapper;
