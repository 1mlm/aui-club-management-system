import type { ClubColor, ClubIconKey } from "@/db/catalog";

export type ClubRecord = {
  id: number;
  name: string;
  description: string | null;
  color: ClubColor | null;
  icon: ClubIconKey | null;
};

export type ClubQueryRow = {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
};
