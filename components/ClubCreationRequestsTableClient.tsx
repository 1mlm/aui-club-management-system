"use client";

import { useState, useTransition } from "react";
import { AdminTable, type TableColumn } from "@/components/AdminTable";
import type { ClubCreationRequest } from "@/db/club-requests";
import { serverApproveClubCreationRequest, serverRejectClubCreationRequest } from "@/app/actions";
import { ICON_MAP } from "@/lib/icon-map";
import { toast } from "sonner";

export function ClubCreationRequestsTableClient({
  initialRequests,
}: {
  initialRequests: ClubCreationRequest[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [isPending, startTransition] = useTransition();

  const handleAction = (request: ClubCreationRequest, action: string) => {
    startTransition(async () => {
      try {
        if (action === "approve") {
          await serverApproveClubCreationRequest(request.id);
          setRequests((prev) =>
            prev.map((r) => (r.id === request.id ? { ...r, status: "approved" as const } : r))
          );
          toast.success(`"${request.name}" approved — club is now live!`);
        } else if (action === "reject") {
          await serverRejectClubCreationRequest(request.id);
          setRequests((prev) =>
            prev.map((r) => (r.id === request.id ? { ...r, status: "rejected" as const } : r))
          );
          toast.success(`"${request.name}" rejected.`);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Action failed.");
      }
    });
  };

  const columns: TableColumn<ClubCreationRequest>[] = [
    { key: "initiatorEmail", label: "Requested By" },
    { key: "name", label: "Club Name" },
    { key: "email", label: "Club Email" },
    {
      key: "color",
      label: "Color",
      render: (val) => val ? String(val) : "—",
    },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        const status = String(val);
        const colors: Record<string, string> = {
          pending: "text-amber-500",
          approved: "text-emerald-600",
          rejected: "text-destructive",
        };
        return <span className={`font-medium capitalize ${colors[status] ?? ""}`}>{status}</span>;
      },
    },
    {
      key: "createdAt",
      label: "Submitted",
      render: (val) => new Date(val as string).toLocaleDateString(),
    },
  ];

  return (
    <AdminTable
      data={requests}
      columns={columns}
      searchKeys={["initiatorEmail", "name"]}
      title="Club Creation Requests"
      actionButtons={(request) =>
        request.status === "pending"
          ? [
              { label: "Approve", action: "approve", icon: ICON_MAP.actions.approve },
              { label: "Reject", action: "reject", icon: ICON_MAP.actions.reject },
            ]
          : []
      }
      onRowAction={handleAction}
    />
  );
}
