"use client";

import React from "react";
import { CLUB_COLOR_HEX, type ClubColor } from "@/db/catalog";
import { cn } from "@/shadcn/lib/utils";
import { Icon } from "@/shadcn/cpns/Icon";
import { Check } from "@hugeicons/core-free-icons";

type ColorPickerProps = {
  value: ClubColor;
  onChange: (value: ClubColor) => void;
  className?: string;
};

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 rounded-lg border border-border bg-muted/40 p-3", className)}>
      {(Object.keys(CLUB_COLOR_HEX) as ClubColor[]).map((colorKey) => {
        const isSelected = value === colorKey;
        const hex = CLUB_COLOR_HEX[colorKey];

        return (
          <button
            key={colorKey}
            type="button"
            onClick={() => onChange(colorKey)}
            className={cn(
              "relative flex size-8 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95",
              isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110" : "opacity-80 hover:opacity-100"
            )}
            style={{ backgroundColor: hex }}
            title={colorKey.charAt(0) + colorKey.slice(1).toLowerCase()}
          >
            {isSelected && <Icon icon={Check} className="size-3.5 text-white drop-shadow" />}
          </button>
        );
      })}
    </div>
  );
}
