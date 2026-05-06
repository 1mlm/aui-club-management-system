"use client";

import { ALLOWED_ICON_MAP, type ClubIconKey } from "@/db/catalog";
import { Icon } from "@/shadcn/cpns/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";

type IconPickerProps = {
  value: ClubIconKey;
  onChange: (value: ClubIconKey) => void;
  className?: string;
};

function formatIconLabel(key: string) {
  return key
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ClubIconKey)}>
      <SelectTrigger className={className}>
        <SelectValue>
          <span className="flex items-center gap-2">
            <Icon icon={ALLOWED_ICON_MAP[value]} className="size-4 shrink-0" />
            <span>{formatIconLabel(value)}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {(Object.keys(ALLOWED_ICON_MAP) as ClubIconKey[]).map((iconKey) => (
          <SelectItem key={iconKey} value={iconKey}>
            <span className="flex items-center gap-2">
              <Icon icon={ALLOWED_ICON_MAP[iconKey]} className="size-4 shrink-0" />
              <span>{formatIconLabel(iconKey)}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
