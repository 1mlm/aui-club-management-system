import type { ClubColor, ClubIconKey } from "@/db/catalog";

export type ClubRecord = {
  id: number;
  owner_id: number;
  name: string;
  description: string | null;
  color: ClubColor | null;
  icon: ClubIconKey | null;
  memberCount: number;
  member_count: number;
};

export type ClubQueryRow = {
  id: number;
  owner_id: number;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  member_count: number;
};

export type ClubMember = {
  id: number;
  membership_id: number;
  user_id: number;
  email: string;
  display_name: string | null;
  membership_role: "board_member" | "member";
  joined_at: Date | string;
};

export type PostRecord = {
  id: number;
  club_id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: Date | string;
  updated_at: Date | string | null;
  is_deleted: boolean;
  is_pinned: boolean;
  like_count: number;
  user_liked: boolean;
  author_display_name?: string;
};

export type PostQueryRow = {
  id: number;
  club_id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: Date | string;
  updated_at: Date | string | null;
  is_deleted: boolean;
  is_pinned: boolean;
  like_count: number;
  user_liked: boolean;
  author_display_name: string;
};

export type ActivityLogEntry = {
  log_id: number;
  actor_name: string | null;
  club_name: string | null;
  action: string;
  detail: string | null;
  created_at: Date | string;
};

export type MyClub = {
  id: number;
  name: string;
  color: ClubColor | null;
  icon: ClubIconKey | null;
  role: "owner" | "board_member" | "member";
};

export type FeedPost = {
  id: number;
  club_id: number;
  club_name: string;
  club_color: ClubColor | null;
  club_icon: ClubIconKey | null;
  title: string;
  content: string;
  created_at: Date | string;
  author_display_name: string;
};

export type ClubJoinRequest = {
  id: number;
  user_id: number;
  user_email: string;
  user_display_name: string;
  message: string | null;
  created_at: Date | string;
  status: "pending" | "approved" | "rejected" | "waitlisted";
};

export type MyJoinRequest = {
  id: number;
  club_id: number;
  club_name: string;
  status: "pending" | "approved" | "rejected";
  created_at: Date | string;
};
