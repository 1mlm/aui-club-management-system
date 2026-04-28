"use client";

import { useState } from "react";
import { serverApproveJoinRequest, serverRejectJoinRequest } from "@/app/actions";
import type { AdminJoinRequest } from "@/db/admin-types";
import { AdminTable, type TableColumn } from "@/components/AdminTable";

type JoinRequestsTableClientProps = {
  initialRequests: AdminJoinRequest[];
};

export function JoinRequestsTableClient({ initialRequests }: JoinRequestsTableClientProps) {
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
    { key: "userEmail", label: "User Email" },
    { key: "clubName", label: "Club Name" },
    { key: "status", label: "Status" },
    {
      key: "createdAt",
      label: "Created",
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
