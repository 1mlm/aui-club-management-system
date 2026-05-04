import type { ClubColor, ClubIconKey } from "@/db/catalog";

export type ClubRecord = {
  id: number;
  owner_id: number;
  name: string;
  description: string | null;
  color: ClubColor | null;
  icon: ClubIconKey | null;
};

export type ClubQueryRow = {
  id: number;
  owner_id: number;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
};

export type ClubMember = {
  id: number;
  membership_id: number;
  user_id: number;
  email: string;
  display_name: string;
  membership_role: "board_member" | "member";
  membership_status: "pending" | "active" | "rejected" | "left" | "banned";
  joined_at: Date | string;
};
