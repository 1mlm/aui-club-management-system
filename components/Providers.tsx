import { NuqsAdapter } from "nuqs/adapters/next";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
