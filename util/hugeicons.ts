import type { HugeiconsIconProps } from "@hugeicons/react";

export type Hugeicon = HugeiconsIconProps["icon"];
export type HugeiconList = readonly Hugeicon[];

type HugeiconEntry = Hugeicon[number];

function isHugeiconEntry(value: unknown): value is HugeiconEntry {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "string" &&
    typeof value[1] === "object" &&
    value[1] !== null &&
    !Array.isArray(value[1])
  );
}

export function isHugeicon(value: unknown): value is Hugeicon {
  return Array.isArray(value) && value.every(isHugeiconEntry);
}

export function isHugeiconList(value: unknown): value is HugeiconList {
  return Array.isArray(value) && value.every(isHugeicon);
}

export function toHugeiconList(value: Hugeicon | HugeiconList): Hugeicon[] {
  return isHugeicon(value) ? [value] : [...value];
}
