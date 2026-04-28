"use client";

import { useState } from "react";
import { serverUpdateClubStatus } from "@/app/actions";
import { AdminTable, type TableColumn } from "@/components/AdminTable";
import type { AdminClub } from "@/db/admin-types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcn/ui/alert-dialog";

type ClubsTableClientProps = {
  initialClubs: AdminClub[];
};

export function ClubsTableClient({ initialClubs }: ClubsTableClientProps) {
  const [clubs, setClubs] = useState<AdminClub[]>(initialClubs);
  const [dialog, setDialog] = useState<{
    type: "status" | null;
    club: AdminClub | null;
    newStatus?: string;
  }>({ type: null, club: null });

  const handleStatusChange = async (club: AdminClub) => {
    if (
      dialog.club?.id === club.id &&
      dialog.type === "status" &&
      dialog.newStatus
    ) {
      try {
        await serverUpdateClubStatus(club.id, dialog.newStatus);
        setClubs(
          clubs.map((c) =>
            c.id === club.id ? { ...c, status: dialog.newStatus! } : c,
          ),
        );
        setDialog({ type: null, club: null });
      } catch (error) {
        console.error("Failed to update club status:", error);
      }
    } else {
      setDialog({ type: "status", club, newStatus: club.status });
    }
  };

  const columns: TableColumn<AdminClub>[] = [
    { key: "name", label: "Club Name" },
    { key: "ownerEmail", label: "Owner" },
    { key: "status", label: "Status" },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  return (
    <>
      <AdminTable
        data={clubs}
        columns={columns}
        searchKeys={["name", "ownerEmail"]}
        title="Clubs"
        actionButtons={() => [
          { label: "Change Status", action: "change_status" },
        ]}
        onRowAction={(club, action) => {
          if (action === "change_status") handleStatusChange(club);
        }}
      />

      <AlertDialog open={!!dialog.club}>
        <AlertDialogContent>
          {dialog.type === "status" && dialog.club && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Change Club Status</AlertDialogTitle>
                <AlertDialogDescription>
                  <select
                    value={dialog.newStatus || ""}
                    onChange={(e) =>
                      setDialog({ ...dialog, newStatus: e.target.value })
                    }
                    className="w-full px-3 py-2 mt-4 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="deleted">Deleted</option>
                  </select>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setDialog({ type: null, club: null })}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleStatusChange(dialog.club!)}
                >
                  Update
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
