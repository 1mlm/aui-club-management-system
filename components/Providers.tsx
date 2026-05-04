import { NuqsAdapter } from "nuqs/adapters/next";
import type { PropsWithChildren } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export function Providers({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <AuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </NuqsAdapter>
  );
}
