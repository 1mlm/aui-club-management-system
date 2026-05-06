"use client";

import { useState } from "react";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { Button } from "@/shadcn/ui/button";
import { serverApproveClubJoinRequest, serverRejectClubJoinRequest } from "@/app/actions";
import type { ClubJoinRequest } from "@/db/types";
import { toast } from "sonner";

type Props = {
  initialRequests: ClubJoinRequest[];
};

export function ClubJoinRequestsClient({ initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests);

  if (requests.length === 0) return null;

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

  return (
    <div className="pt-8 border-t mt-8">
      <h2 className="text-xl font-semibold mb-4 text-foreground/80 flex items-center gap-2">
        <Icon icon={ICON_MAP.status.pending} className="size-5" />
        Pending Join Requests
        <span className="ml-1 text-sm font-normal bg-primary text-primary-foreground rounded-full px-2 py-0.5">
          {requests.length}
        </span>
      </h2>
      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="rounded-xl border p-4 bg-card flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{req.user_display_name}</span>
                <span className="text-xs text-muted-foreground">{req.user_email}</span>
              </div>
              {req.message && (
                <p className="text-sm text-muted-foreground italic">"{req.message}"</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(req.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => handleApprove(req)} className="gap-1.5 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
                <Icon icon={ICON_MAP.actions.approve} className="size-3.5" /> Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleReject(req)} className="gap-1.5 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive">
                <Icon icon={ICON_MAP.actions.reject} className="size-3.5" /> Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
