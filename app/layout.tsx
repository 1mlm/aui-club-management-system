import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import type { PropsWithChildren } from "react";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";

const outfit = Outfit();

export const metadata: Metadata = {
  title: "AUI Clubs",
  description: "Aui club management system",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={outfit.className}>
      <body className={`antialiased w-screen min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
