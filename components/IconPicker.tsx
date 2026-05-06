"use client";

import React from "react";
import { ALLOWED_ICON_MAP, type ClubIconKey } from "@/db/catalog";
import { cn } from "@/shadcn/lib/utils";
import { Icon } from "@/shadcn/cpns/Icon";

type IconPickerProps = {
  value: ClubIconKey;
  onChange: (value: ClubIconKey) => void;
  className?: string;
};

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  return (
    <div className={cn("grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto p-1", className)}>
      {(Object.keys(ALLOWED_ICON_MAP) as ClubIconKey[]).map((iconKey) => {
        const isSelected = value === iconKey;
        const icon = ALLOWED_ICON_MAP[iconKey];
        
        return (
          <button
            key={iconKey}
            type="button"
            onClick={() => onChange(iconKey)}
            className={cn(
              "flex size-10 items-center justify-center rounded-md border transition-all hover:bg-slate-50 hover:scale-105 active:scale-95",
              isSelected 
                ? "bg-primary/10 border-primary text-primary" 
                : "bg-white border-slate-200 text-slate-600"
            )}
            title={iconKey}
          >
            <Icon icon={icon} className="size-5" />
          </button>
        );
      })}
    </div>
  );
}
