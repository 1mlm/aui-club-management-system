"use server";

import {
  approveJoinRequest as approveJoinRequestDb,
  deleteUser as deleteUserDb,
  rejectJoinRequest as rejectJoinRequestDb,
  updateClubStatus as updateClubStatusDb,
  updateUserAdminStatus as updateUserAdminStatusDb,
  updateUserDisplayName as updateUserDisplayNameDb,
} from "@/db/admin";
import { updateClubMemberStatus, updateClubMemberRole, updateClubInfo, createPost, requestJoinClub, leaveClub, approveClubJoinRequest, rejectClubJoinRequest } from "@/db/club-management";

export async function serverUpdateUserAdminStatus(
  userId: number,
  isAdmin: boolean,
): Promise<void> {
  await updateUserAdminStatusDb(userId, isAdmin);
}

export async function serverUpdateUserDisplayName(
  userId: number,
  displayName: string,
): Promise<void> {
  await updateUserDisplayNameDb(userId, displayName);
}

export async function serverDeleteUser(userId: number): Promise<void> {
  await deleteUserDb(userId);
}

export async function serverUpdateClubStatus(
  clubId: number,
  status: string,
): Promise<void> {
  await updateClubStatusDb(clubId, status);
}

export async function serverApproveJoinRequest(
  requestId: number,
): Promise<void> {
  await approveJoinRequestDb(requestId);
}

export async function serverRejectJoinRequest(
  requestId: number,
): Promise<void> {
  await rejectJoinRequestDb(requestId);
}

export async function serverUpdateClubMemberStatus(clubId: number, userId: number, status: string) {
  await updateClubMemberStatus(clubId, userId, status);
}

export async function serverUpdateClubMemberRole(clubId: number, userId: number, role: string) {
  await updateClubMemberRole(clubId, userId, role);
}

export async function serverUpdateClubInfo(clubId: number, data: { name?: string, description?: string }) {
  await updateClubInfo(clubId, data);
}

export async function serverCreatePost(clubId: number, userId: number, title: string, content: string) {
  await createPost(clubId, userId, title, content);
}

export async function serverRequestJoinClub(clubId: number, userId: number, message?: string) {
  await requestJoinClub(clubId, userId, message);
}

export async function serverLeaveClub(clubId: number, userId: number) {
  await leaveClub(clubId, userId);
}

export async function serverApproveClubJoinRequest(requestId: number) {
  await approveClubJoinRequest(requestId);
}

export async function serverRejectClubJoinRequest(requestId: number) {
  await rejectClubJoinRequest(requestId);
}
