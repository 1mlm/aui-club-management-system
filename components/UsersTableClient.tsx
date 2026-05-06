"use client";

import { useState } from "react";
import {
  serverDeleteUser,
  serverUpdateUserAdminStatus,
  serverUpdateUserDisplayName,
  serverAdminCreateUser,
} from "@/app/actions";
import { AdminTable, type TableColumn } from "@/components/AdminTable";
import type { AdminUser } from "@/db/admin-types";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
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
import { Button } from "@/shadcn/ui/button";
import { Label } from "@/shadcn/ui/label";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";

type UsersTableClientProps = {
  initialUsers: AdminUser[];
};

export function UsersTableClient({ initialUsers }: UsersTableClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [dialog, setDialog] = useState<{
    type: "confirm_admin" | "edit_name" | "delete" | "create" | null;
    user: AdminUser | null;
    newValue?: string;
  }>({ type: null, user: null });
  const [createForm, setCreateForm] = useState({ email: "", displayName: "", passwordRaw: "" });

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

  const handleCreateUser = async () => {
    if (!createForm.email || !createForm.displayName || !createForm.passwordRaw) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const newUser = await serverAdminCreateUser(createForm.email, createForm.displayName, createForm.passwordRaw);
      setUsers([newUser, ...users]);
      setDialog({ type: null, user: null });
      setCreateForm({ email: "", displayName: "", passwordRaw: "" });
      toast.success("User created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    }
  };

  const columns: TableColumn<AdminUser>[] = [
    {
      key: "id",
      label: "ID",
      icon: ICON_MAP.nav.browse,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">#{String(value)}</span>
      ),
    },
    { key: "email", label: "Email", icon: ICON_MAP.nav.users },
    { key: "displayName", label: "Display Name", icon: ICON_MAP.user.profile },
    {
      key: "isSystemAdmin",
      label: "Role",
      icon: ICON_MAP.actions.admin,
      render: (value) => (
        <StatusBadge type="admin_status" value={value as boolean} />
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      icon: ICON_MAP.status.pending,
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialog({ type: "create", user: null })}>
          <span className="flex items-center gap-2">
            <Icon icon={ICON_MAP.actions.create} />
            Create User
          </span>
        </Button>
      </div>
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

      <AlertDialog open={!!dialog.type}>
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

          {dialog.type === "create" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Create New User</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-email">Email</Label>
                      <Input
                        id="create-email"
                        value={createForm.email}
                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                        placeholder="user@aui.ma"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-displayName">Display Name</Label>
                      <Input
                        id="create-displayName"
                        value={createForm.displayName}
                        onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-password">Password</Label>
                      <Input
                        id="create-password"
                        type="password"
                        value={createForm.passwordRaw}
                        onChange={(e) => setCreateForm({ ...createForm, passwordRaw: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel onClick={() => setDialog({ type: null, user: null })}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateUser}>
                  Create
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
