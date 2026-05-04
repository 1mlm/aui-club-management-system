"use server";

import { cookies } from "next/headers";
import {
  approveJoinRequest as approveJoinRequestDb,
  deleteUser as deleteUserDb,
  rejectJoinRequest as rejectJoinRequestDb,
  updateClubStatus as updateClubStatusDb,
  updateUserAdminStatus as updateUserAdminStatusDb,
  updateUserDisplayName as updateUserDisplayNameDb,
} from "@/db/admin";
import { updateClubMemberStatus, updateClubMemberRole, updateClubInfo, createJoinRequest } from "@/db/club-management";
import { AUTH_COOKIE_NAME } from "@/db/auth-cookie";
import {
  submitClubCreationRequest,
  approveClubCreationRequest,
  rejectClubCreationRequest,
} from "@/db/club-requests";

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

export async function serverCreateJoinRequest(clubId: number): Promise<void> {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = rawUserId ? Number(rawUserId) : NaN;
  if (!Number.isFinite(userId)) throw new Error("You must be logged in to request to join a club.");
  await createJoinRequest(userId, clubId);
}

export async function serverSubmitClubCreationRequest(data: {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  email: string;
}): Promise<void> {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = rawUserId ? Number(rawUserId) : NaN;
  if (!Number.isFinite(userId)) throw new Error("You must be logged in to submit a club creation request.");
  await submitClubCreationRequest({ userId, ...data });
}

export async function serverApproveClubCreationRequest(requestId: number): Promise<void> {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const reviewerId = rawUserId ? Number(rawUserId) : NaN;
  if (!Number.isFinite(reviewerId)) throw new Error("Not authenticated.");
  await approveClubCreationRequest(requestId, reviewerId);
}

export async function serverRejectClubCreationRequest(
  requestId: number,
  message?: string
): Promise<void> {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const reviewerId = rawUserId ? Number(rawUserId) : NaN;
  if (!Number.isFinite(reviewerId)) throw new Error("Not authenticated.");
  await rejectClubCreationRequest(requestId, reviewerId, message);
}
