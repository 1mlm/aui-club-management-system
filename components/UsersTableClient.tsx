"use client";

import { useState } from "react";
import {
  serverDeleteUser,
  serverUpdateUserAdminStatus,
  serverUpdateUserDisplayName,
} from "@/app/actions";
import { AdminTable, type TableColumn } from "@/components/AdminTable";
import type { AdminUser } from "@/db/admin-types";
import { ICON_MAP } from "@/lib/icon-map";
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
import { Input } from "@/shadcn/ui/input";

type UsersTableClientProps = {
  initialUsers: AdminUser[];
};

export function UsersTableClient({ initialUsers }: UsersTableClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [dialog, setDialog] = useState<{
    type: "confirm_admin" | "edit_name" | "delete" | null;
    user: AdminUser | null;
    newValue?: string;
  }>({ type: null, user: null });

  const handleToggleAdmin = async (user: AdminUser) => {
    if (dialog.user?.id === user.id && dialog.type === "confirm_admin") {
      try {
        await serverUpdateUserAdminStatus(user.id, !user.isSystemAdmin);
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, isSystemAdmin: !u.isSystemAdmin } : u,
          ),
        );
        setDialog({ type: null, user: null });
      } catch (error) {
        console.error("Failed to update admin status:", error);
      }
    } else {
      setDialog({ type: "confirm_admin", user });
    }
  };

  const handleEditName = async (user: AdminUser) => {
    const nextValue = dialog.newValue?.trim();
    if (
      dialog.user?.id === user.id &&
      dialog.type === "edit_name" &&
      nextValue
    ) {
      try {
        await serverUpdateUserDisplayName(user.id, nextValue);
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, displayName: nextValue } : u,
          ),
        );
        setDialog({ type: null, user: null, newValue: "" });
      } catch (error) {
        console.error("Failed to update display name:", error);
      }
    } else {
      setDialog({ type: "edit_name", user, newValue: user.displayName });
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (dialog.user?.id === user.id && dialog.type === "delete") {
      try {
        await serverDeleteUser(user.id);
        setUsers(users.filter((u) => u.id !== user.id));
        setDialog({ type: null, user: null });
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    } else {
      setDialog({ type: "delete", user });
    }
  };

  const columns: TableColumn<AdminUser>[] = [
    { key: "email", label: "Email", icon: ICON_MAP.nav.users },
    { key: "displayName", label: "Display Name" },
    {
      key: "isSystemAdmin",
      label: "Admin",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  return (
    <>
      <AdminTable
        data={users}
        columns={columns}
        searchKeys={["email", "displayName"]}
        title="Users"
        actionButtons={(user) => [
          {
            label: user.isSystemAdmin ? "Revoke Admin" : "Make Admin",
            action: "toggle_admin",
          },
          { label: "Edit Name", action: "edit_name" },
          { label: "Delete", action: "delete" },
        ]}
        onRowAction={(user, action) => {
          if (action === "toggle_admin") handleToggleAdmin(user);
          if (action === "edit_name") handleEditName(user);
          if (action === "delete") handleDelete(user);
        }}
      />

      <AlertDialog open={!!dialog.user}>
        <AlertDialogContent>
          {dialog.type === "confirm_admin" && dialog.user && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {dialog.user.isSystemAdmin
                    ? "Revoke Admin Access?"
                    : "Grant Admin Access?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {dialog.user.isSystemAdmin
                    ? `Are you sure you want to revoke admin access for ${dialog.user.email}? They will no longer be able to access this dashboard.`
                    : `Are you sure you want to make ${dialog.user.email} an admin? They will be able to manage the entire system.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setDialog({ type: null, user: null })}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => dialog.user && handleToggleAdmin(dialog.user)}
                >
                  {dialog.user.isSystemAdmin ? "Revoke" : "Grant"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {dialog.type === "edit_name" && dialog.user && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Display Name</AlertDialogTitle>
                <AlertDialogDescription>
                  <Input
                    value={dialog.newValue || ""}
                    onChange={(e) =>
                      setDialog({ ...dialog, newValue: e.target.value })
                    }
                    className="mt-4"
                    placeholder="New display name"
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setDialog({ type: null, user: null })}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => dialog.user && handleEditName(dialog.user)}
                >
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {dialog.type === "delete" && dialog.user && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. You are about to permanently
                  delete {dialog.user.email} and all their associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setDialog({ type: null, user: null })}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => dialog.user && handleDelete(dialog.user)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
