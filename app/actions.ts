"use server";

import {
  approveJoinRequest as approveJoinRequestDb,
  deleteUser as deleteUserDb,
  rejectJoinRequest as rejectJoinRequestDb,
  updateClubStatus as updateClubStatusDb,
  updateUserAdminStatus as updateUserAdminStatusDb,
  updateUserDisplayName as updateUserDisplayNameDb,
} from "@/db/admin";

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
