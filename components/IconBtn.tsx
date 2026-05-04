import type { VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import type { buttonVariants } from "@/shadcn/ui/button";
import { Button } from "@/shadcn/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip";

type ButtonVariant = VariantProps<typeof buttonVariants>;

type IconBtnProps = PropsWithChildren<{
  tooltip: string;
  variant?: ButtonVariant["variant"];
  size?: ButtonVariant["size"];
  className?: string;
  onClick?: () => void;
}>;

export function IconBtn({
  tooltip,
  children,
  variant = "ghost",
  size = "icon-sm",
  className,
  onClick,
}: IconBtnProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          className={className}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
