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
    <div className={cn("grid grid-cols-5 gap-2", className)}>
      {(Object.keys(CLUB_COLOR_HEX) as ClubColor[]).map((colorKey) => {
        const isSelected = value === colorKey;
        const hex = CLUB_COLOR_HEX[colorKey];
        
        return (
          <button
            key={colorKey}
            type="button"
            onClick={() => onChange(colorKey)}
            className={cn(
              "group relative flex size-9 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95",
              isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:ring-1 hover:ring-slate-200"
            )}
            style={{ backgroundColor: hex }}
            title={colorKey}
          >
            {isSelected && <Icon icon={Check} className="size-4 text-white" />}
          </button>
        );
      })}
    </div>
  );
}
