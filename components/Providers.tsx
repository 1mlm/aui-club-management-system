import { NuqsAdapter } from "nuqs/adapters/next";
import type { PropsWithChildren } from "react";
import { AuthProvider } from "@/components/AuthProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <AuthProvider>{children}</AuthProvider>
    </NuqsAdapter>
  );
}
