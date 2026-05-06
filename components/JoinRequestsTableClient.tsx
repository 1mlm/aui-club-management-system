"use client";

import { useState } from "react";
import {
  serverApproveJoinRequest,
  serverRejectJoinRequest,
} from "@/app/actions";
import { AdminTable, type TableColumn } from "@/components/AdminTable";
import type { AdminJoinRequest } from "@/db/admin-types";
import { ICON_MAP } from "@/lib/icon-map";
import { StatusBadge } from "@/components/StatusBadge";
import { UserProfileSheet } from "@/components/UserProfileSheet";

type JoinRequestsTableClientProps = {
  initialRequests: AdminJoinRequest[];
};

export function JoinRequestsTableClient({
  initialRequests,
}: JoinRequestsTableClientProps) {
  const [requests, setRequests] = useState<AdminJoinRequest[]>(initialRequests);

  const handleAction = async (request: AdminJoinRequest, action: string) => {
    try {
      if (action === "approve") {
        await serverApproveJoinRequest(request.id);
        setRequests(
          requests.map((r) =>
            r.id === request.id ? { ...r, status: "approved" } : r,
          ),
        );
      } else if (action === "reject") {
        await serverRejectJoinRequest(request.id);
        setRequests(
          requests.map((r) =>
            r.id === request.id ? { ...r, status: "rejected" } : r,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to handle join request:", error);
    }
  };

  const columns: TableColumn<AdminJoinRequest>[] = [
    {
      key: "userEmail",
      label: "User",
      icon: ICON_MAP.nav.users,
      render: (value, row) => (
        <UserProfileSheet
          userId={row.userId}
          userName={row.userDisplayName}
          trigger={<span>{String(value)}</span>}
        />
      ),
    },
    { key: "clubName", label: "Club Name", icon: ICON_MAP.nav.clubs },
    { 
      key: "status", 
      label: "Status", 
      icon: ICON_MAP.actions.status,
      render: (value) => <StatusBadge type="join_request_status" value={value as string} />
    },
    {
      key: "createdAt",
      label: "Created",
      icon: ICON_MAP.status.pending,
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  return (
    <AdminTable
      data={requests}
      columns={columns}
      searchKeys={["userEmail", "clubName"]}
      title="Join Requests"
      actionButtons={(request) =>
        request.status === "pending"
          ? [
            { label: "Approve", action: "approve" },
            { label: "Reject", action: "reject" },
          ]
          : []
      }
      onRowAction={handleAction}
    />
  );
}
