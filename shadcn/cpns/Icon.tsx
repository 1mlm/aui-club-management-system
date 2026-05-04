import { HugeiconsIcon } from "@hugeicons/react";

type IconProps = React.ComponentProps<typeof HugeiconsIcon>;
const DEFAULT_STROKE_WIDTH = 2;

export function Icon({ strokeWidth = DEFAULT_STROKE_WIDTH, ...props }: IconProps) {
  return <HugeiconsIcon strokeWidth={strokeWidth} {...props} />;
}
