"use client";

import { useState } from "react";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { Button } from "@/shadcn/ui/button";
import {
  serverApproveClubJoinRequest,
  serverRejectClubJoinRequest,
  serverWaitlistJoinRequest,
  serverPromoteFromWaitlist,
} from "@/app/actions";
import type { ClubJoinRequest } from "@/db/types";
import { toast } from "sonner";
import { UserProfileSheet } from "@/components/UserProfileSheet";

type Props = {
  initialRequests: ClubJoinRequest[];
};

export function ClubJoinRequestsClient({ initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests);

  if (requests.length === 0) return null;

  const pending = requests.filter((r) => r.status === "pending");
  const waitlisted = requests.filter((r) => r.status === "waitlisted");

  const handleApprove = async (req: ClubJoinRequest) => {
    try {
      await serverApproveClubJoinRequest(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      toast.success(`${req.user_display_name} approved.`);
    } catch {
      toast.error("Failed to approve request.");
    }
  };

  const handleReject = async (req: ClubJoinRequest) => {
    try {
      await serverRejectClubJoinRequest(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      toast.success(`${req.user_display_name} rejected.`);
    } catch {
      toast.error("Failed to reject request.");
    }
  };

  const handleWaitlist = async (req: ClubJoinRequest) => {
    try {
      await serverWaitlistJoinRequest(req.id);
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: "waitlisted" as const } : r))
      );
      toast.success(`${req.user_display_name} added to waitlist.`);
    } catch {
      toast.error("Failed to waitlist request.");
    }
  };

  const handlePromote = async (req: ClubJoinRequest) => {
    try {
      await serverPromoteFromWaitlist(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      toast.success(`${req.user_display_name} approved from waitlist.`);
    } catch {
      toast.error("Failed to promote from waitlist.");
    }
  };

  const RequestRow = ({ req }: { req: ClubJoinRequest }) => (
    <div key={req.id} className={`rounded-xl border p-4 bg-card flex items-start gap-4 ${req.status === "waitlisted" ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/10" : ""}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <UserProfileSheet userId={req.user_id} userName={req.user_display_name} trigger={
            <span className="font-medium">{req.user_display_name}</span>
          } />
          <span className="text-xs text-muted-foreground">{req.user_email}</span>
          {req.status === "waitlisted" && (
            <span className="text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-2 py-0.5 rounded-full">
              Waitlisted
            </span>
          )}
        </div>
        {req.message && (
          <p className="text-sm text-muted-foreground italic">"{req.message}"</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(req.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        {req.status === "pending" && (
          <>
            <Button size="sm" variant="outline" onClick={() => handleApprove(req)} className="gap-1.5 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
              <Icon icon={ICON_MAP.actions.approve} className="size-3.5" /> Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleWaitlist(req)} className="gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700">
              Waitlist
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleReject(req)} className="gap-1.5 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive">
              <Icon icon={ICON_MAP.actions.reject} className="size-3.5" /> Reject
            </Button>
          </>
        )}
        {req.status === "waitlisted" && (
          <>
            <Button size="sm" variant="outline" onClick={() => handlePromote(req)} className="gap-1.5 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
              Promote
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleReject(req)} className="gap-1.5 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive">
              <Icon icon={ICON_MAP.actions.reject} className="size-3.5" /> Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-8 border-t mt-8">
      <h2 className="text-xl font-semibold mb-4 text-foreground/80 flex items-center gap-2">
        <Icon icon={ICON_MAP.status.pending} className="size-5" />
        Join Requests
        <span className="ml-1 text-sm font-normal bg-primary text-primary-foreground rounded-full px-2 py-0.5">
          {requests.length}
        </span>
      </h2>
      <div className="space-y-3">
        {pending.map((req) => <RequestRow key={req.id} req={req} />)}
        {waitlisted.map((req) => <RequestRow key={req.id} req={req} />)}
      </div>
    </div>
  );
}
