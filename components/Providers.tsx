import { NuqsAdapter } from "nuqs/adapters/next";
import type { PropsWithChildren } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
}
