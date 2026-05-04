import { Button } from "@/shadcn/ui/button";
import type React from "react";

type ButtonProps = React.ComponentProps<typeof Button>;
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";

export function IconBtn({ tooltip, children, ...props }: ButtonProps & { tooltip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...props}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
