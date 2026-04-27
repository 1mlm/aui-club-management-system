import {
  ALLOWED_COLOR_VALUES,
  ALLOWED_ICON_VALUES,
  type ClubColor,
  type ClubIconKey,
} from "@/db/catalog";

const colorSet = new Set<string>(ALLOWED_COLOR_VALUES);
const iconSet = new Set<string>(ALLOWED_ICON_VALUES);

export function validateClubColor(value: unknown): ClubColor | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Invalid club color: expected a string or null");
  }

  const normalized = value.trim().toUpperCase();
  if (!colorSet.has(normalized)) {
    throw new Error(`Invalid club color: ${value}`);
  }

  return normalized as ClubColor;
}

export function validateClubIcon(value: unknown): ClubIconKey | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Invalid club icon: expected a string or null");
  }

  const normalized = value.trim().toUpperCase();
  if (!iconSet.has(normalized)) {
    throw new Error(`Invalid club icon: ${value}`);
  }

  return normalized as ClubIconKey;
}
