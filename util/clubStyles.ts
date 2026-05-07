import { CLUB_COLOR_HEX, type ClubColor } from "@/db/catalog";

const CLUB_DEFAULT_TEXT_COLOR_LIGHT = "#000000";
const CLUB_DEFAULT_TEXT_COLOR_DARK = "#FFFFFF";

const CLUB_DEFAULT_TEXT_COLOR = `light-dark(${CLUB_DEFAULT_TEXT_COLOR_LIGHT}, ${CLUB_DEFAULT_TEXT_COLOR_DARK})`;
const CLUB_DEFAULT_BG_COLOR =
  "light-dark(rgba(0, 0, 0, 0.1), rgba(250, 250, 250, 0.1))";
const CLUB_DEFAULT_BORDER_COLOR =
  "light-dark(rgba(0, 0, 0, 0.5), rgba(250, 250, 250, 0.5))";
const CLUB_DEFAULT_SHADOW_COLOR =
  "light-dark(rgba(0, 0, 0, 0.5), rgba(250, 250, 250, 0.5))";

export interface ClubColorStyles {
  bg: string;
  text: string;
  border: string;
  shadow: string;
  primary: string;
  primaryHover: string;
}

export function getClubColorStyles(color?: ClubColor): ClubColorStyles {
  if (!color) {
    return {
      bg: CLUB_DEFAULT_BG_COLOR,
      text: CLUB_DEFAULT_TEXT_COLOR,
      border: CLUB_DEFAULT_BORDER_COLOR,
      shadow: CLUB_DEFAULT_SHADOW_COLOR,
      primary: CLUB_DEFAULT_TEXT_COLOR,
      primaryHover: CLUB_DEFAULT_TEXT_COLOR,
    };
  }

  const hex = CLUB_COLOR_HEX[color];
  const rgb = hexToRgb(hex);

  return {
    bg: `light-dark(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12))`,
    text: `light-dark(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.85), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.95))`,
    border: `light-dark(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25))`,
    shadow: `light-dark(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1), rgba(0, 0, 0, 0.4))`,
    primary: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    primaryHover: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.85)`,
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid hex color: ${hex}`);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}
