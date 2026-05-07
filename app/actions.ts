"use server";

import { cookies } from "next/headers";
import {
  adminCreateClub,
  adminCreateUser,
  adminDeleteClub,
  approveJoinRequest as approveJoinRequestDb,
  deleteUser as deleteUserDb,
  rejectJoinRequest as rejectJoinRequestDb,
  updateClubStatus as updateClubStatusDb,
  updateUserAdminStatus as updateUserAdminStatusDb,
  updateUserDisplayName as updateUserDisplayNameDb,
} from "@/db/admin";
import { AUTH_COOKIE_NAME } from "@/db/auth-cookie";
import {
  approveClubJoinRequest,
  createPost,
  deletePost,
  editPost,
  leaveClub,
  promoteFromWaitlist,
  rejectClubJoinRequest,
  requestJoinClub,
  togglePinPost,
  togglePostLike,
  updateClubInfo,
  updateClubMemberRole,
  updateClubMemberStatus,
  waitlistJoinRequest,
} from "@/db/club-management";
import {
  approveClubCreationRequest,
  rejectClubCreationRequest,
  submitClubCreationRequest,
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

export async function serverUpdateClubMemberStatus(
  clubId: number,
  userId: number,
  status: string,
) {
  await updateClubMemberStatus(clubId, userId, status);
}

export async function serverUpdateClubMemberRole(
  clubId: number,
  userId: number,
  role: string,
) {
  await updateClubMemberRole(clubId, userId, role);
}

export async function serverUpdateClubInfo(
  clubId: number,
  data: {
    name?: string;
    description?: string;
    main_color?: string;
    icon_name?: string;
  },
) {
  await updateClubInfo(clubId, data);
}

export async function serverCreatePost(
  clubId: number,
  userId: number,
  title: string,
  content: string,
) {
  await createPost(clubId, userId, title, content);
}

export async function serverRequestJoinClub(
  clubId: number,
  userId: number,
  message?: string,
) {
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

export async function serverAdminCreateUser(
  email: string,
  displayName: string,
  passwordRaw: string,
) {
  return await adminCreateUser(email, displayName, passwordRaw);
}

export async function serverAdminCreateClub(
  name: string,
  ownerEmail: string,
  description: string,
  mainColor: string,
  iconName: string,
) {
  return await adminCreateClub(
    name,
    ownerEmail,
    description,
    mainColor,
    iconName,
  );
}

export async function serverAdminDeleteClub(clubId: number) {
  await adminDeleteClub(clubId);
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
  if (!Number.isFinite(userId))
    throw new Error("You must be logged in to submit a club creation request.");
  await submitClubCreationRequest({ userId, ...data });
}

export async function serverApproveClubCreationRequest(
  requestId: number,
): Promise<void> {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const reviewerId = rawUserId ? Number(rawUserId) : NaN;
  if (!Number.isFinite(reviewerId)) throw new Error("Not authenticated.");
  await approveClubCreationRequest(requestId, reviewerId);
}

export async function serverWaitlistJoinRequest(requestId: number) {
  await waitlistJoinRequest(requestId);
}

export async function serverPromoteFromWaitlist(requestId: number) {
  await promoteFromWaitlist(requestId);
}

export async function serverDeletePost(postId: number) {
  await deletePost(postId);
}

export async function serverEditPost(
  postId: number,
  title: string,
  content: string,
) {
  await editPost(postId, title, content);
}

export async function serverTogglePinPost(postId: number, pin: boolean) {
  await togglePinPost(postId, pin);
}

export async function serverTogglePostLike(
  postId: number,
): Promise<{ liked: boolean; count: number }> {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = rawUserId ? Number(rawUserId) : NaN;
  if (!Number.isFinite(userId))
    throw new Error("You must be logged in to like a post.");
  return await togglePostLike(postId, userId);
}

export async function serverRejectClubCreationRequest(
  requestId: number,
  message?: string,
): Promise<void> {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const reviewerId = rawUserId ? Number(rawUserId) : NaN;
  if (!Number.isFinite(reviewerId)) throw new Error("Not authenticated.");
  await rejectClubCreationRequest(requestId, reviewerId, message);
}

export async function serverCreateJoinRequest(
  clubId: number,
  message?: string,
) {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const userId = rawUserId ? Number(rawUserId) : NaN;
  if (!Number.isFinite(userId))
    throw new Error("You must be logged in to request to join a club.");
  await requestJoinClub(clubId, userId, message);
}
