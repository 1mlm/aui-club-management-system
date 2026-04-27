import {
  AdventureIcon,
  CameraIcon,
  ChessKingIcon,
  ComputerTerminalIcon,
  CookBookIcon,
  FootballIcon,
  Knowledge01Icon,
  LaurelWreath01Icon,
  MaskTheaterIcon,
  MusicNote02Icon,
  PaintBoardIcon,
  SparklesIcon,
  SuperMarioIcon,
  TennisRacketIcon,
} from "@hugeicons/core-free-icons";
import type { Hugeicon } from "@/util/hugeicons";

export const CLUB_COLOR_HEX = {
  BLUE: "#3B82F6",
  BLACK: "#999999",
  RED: "#EF4444",
  GREEN: "#22C55E",
  AMBER: "#F59E0B",
  ORANGE: "#F97316",
  YELLOW: "#FFD359",
  CYAN: "#06B6D4",
  PINK: "#EC4899",
  PURPLE: "#A855F7",
} as const;

export type ClubColor = keyof typeof CLUB_COLOR_HEX;

export const ALLOWED_ICON_MAP = {
  ADVENTURE: AdventureIcon,
  AI_SPARKLES: SparklesIcon,
  CAMERA: CameraIcon,
  CHESS_KING: ChessKingIcon,
  CODE_TERMINAL: ComputerTerminalIcon,
  COOKBOOK: CookBookIcon,
  FOOTBALL: FootballIcon,
  KNOWLEDGE: Knowledge01Icon,
  LAUREL_WREATH: LaurelWreath01Icon,
  MUSIC_NOTE: MusicNote02Icon,
  PAINT_BOARD: PaintBoardIcon,
  SUPER_MARIO: SuperMarioIcon,
  TENNIS_RACKET: TennisRacketIcon,
  THEATER_MASK: MaskTheaterIcon,
} as const satisfies Record<string, Hugeicon>;

export type ClubIconKey = keyof typeof ALLOWED_ICON_MAP;

export const ALLOWED_COLOR_VALUES = Object.keys(CLUB_COLOR_HEX) as ClubColor[];
export const ALLOWED_ICON_VALUES = Object.keys(
  ALLOWED_ICON_MAP,
) as ClubIconKey[];
