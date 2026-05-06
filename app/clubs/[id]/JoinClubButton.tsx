"use client";

import { useState, useTransition } from "react";
import { Button } from "@/shadcn/ui/button";
import { Icon } from "@/shadcn/cpns/Icon";
import { ICON_MAP } from "@/lib/icon-map";
import { serverCreateJoinRequest } from "@/app/actions";
import { toast } from "sonner";

type JoinStatus = "none" | "pending";

export function JoinClubButton({
  clubId,
  initialStatus,
}: {
  clubId: number;
  initialStatus: JoinStatus;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleJoin = () => {
    startTransition(async () => {
      try {
        await serverCreateJoinRequest(clubId);
        setStatus("pending");
        toast.success("Join request sent! Wait for approval.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to send request");
      }
    });
  };

  if (status === "pending") {
    return (
      <Button variant="outline" disabled className="opacity-70 cursor-not-allowed">
        <Icon icon={ICON_MAP.status.success} className="mr-2 size-4" />
        Request Pending
      </Button>
    );
  }

  return (
    <Button
      onClick={handleJoin}
      disabled={isPending}
      className="bg-emerald-600 hover:bg-emerald-500 text-white"
    >
      <Icon icon={ICON_MAP.nav.joinRequests} className="mr-2 size-4" />
      {isPending ? "Sending..." : "Request to Join"}
    </Button>
  );
}
