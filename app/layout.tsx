import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import type { PropsWithChildren } from "react";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";
import { AppSidebar } from "@/shadcn/cpns/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/shadcn/ui/sidebar";
import { Toaster } from "sonner";
import { TourProvider } from "@/components/TourProvider";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AUI Clubs",
  description: "Aui club management system",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
        <TourProvider />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
