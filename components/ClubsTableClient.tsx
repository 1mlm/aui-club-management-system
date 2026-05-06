"use client";

import { useState } from "react";
import {
  serverUpdateClubStatus,
  serverAdminCreateClub,
  serverAdminDeleteClub,
  serverUpdateClubInfo,
} from "@/app/actions";
import { AdminTable, type TableColumn } from "@/components/AdminTable";
import type { AdminClub } from "@/db/admin-types";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";
import { ColorPicker } from "@/components/ColorPicker";
import { IconPicker } from "@/components/IconPicker";
import { ALLOWED_ICON_MAP, CLUB_COLOR_HEX, type ClubColor, type ClubIconKey } from "@/db/catalog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";

type ClubsTableClientProps = {
  initialClubs: AdminClub[];
};

export function ClubsTableClient({ initialClubs }: ClubsTableClientProps) {
  const [clubs, setClubs] = useState<AdminClub[]>(initialClubs);
  const [dialog, setDialog] = useState<{
    type: "status" | "create" | "edit" | "delete" | null;
    club: AdminClub | null;
    newStatus?: string;
  }>({ type: null, club: null });
  const [createForm, setCreateForm] = useState<{
    name: string;
    ownerEmail: string;
    description: string;
    mainColor: ClubColor;
    iconName: ClubIconKey;
  }>({
    name: "",
    ownerEmail: "",
    description: "",
    mainColor: "BLUE",
    iconName: "ADVENTURE",
  });
  const [editForm, setEditForm] = useState({ name: "", description: "", mainColor: "BLUE" as ClubColor, iconName: "ADVENTURE" as ClubIconKey });

  const handleStatusChange = async (club: AdminClub) => {
    const nextStatus = dialog.newStatus?.trim();
    if (
      dialog.club?.id === club.id &&
      dialog.type === "status" &&
      nextStatus
    ) {
      try {
        await serverUpdateClubStatus(club.id, nextStatus);
        setClubs(
          clubs.map((c) =>
            c.id === club.id ? { ...c, status: nextStatus } : c,
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

  const handleCreateClub = async () => {
    if (!createForm.name || !createForm.ownerEmail || !createForm.description) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const newClub = await serverAdminCreateClub(
        createForm.name,
        createForm.ownerEmail,
        createForm.description,
        createForm.mainColor,
        createForm.iconName
      );
      setClubs([newClub, ...clubs]);
      setDialog({ type: null, club: null });
      setCreateForm({
        name: "",
        ownerEmail: "",
        description: "",
        mainColor: "BLUE",
        iconName: "ADVENTURE",
      });
      toast.success("Club created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create club");
    }
  };

  const handleEditClub = async (club: AdminClub) => {
    if (dialog.club?.id === club.id && dialog.type === "edit") {
      try {
        await serverUpdateClubInfo(club.id, {
          name: editForm.name,
          main_color: editForm.mainColor,
          icon_name: editForm.iconName,
        });
        setClubs(
          clubs.map((c) =>
            c.id === club.id
              ? {
                  ...c,
                  name: editForm.name,
                  mainColor: editForm.mainColor,
                  iconName: editForm.iconName,
                }
              : c
          )
        );
        setDialog({ type: null, club: null });
        toast.success("Club updated successfully");
      } catch (error: any) {
        toast.error("Failed to update club");
      }
    } else {
      setDialog({ type: "edit", club });
      setEditForm({
        name: club.name,
        description: "",
        mainColor: (club.mainColor as ClubColor) || "BLUE",
        iconName: (club.iconName as ClubIconKey) || "ADVENTURE",
      });
    }
  };

  const handleDeleteClub = async (club: AdminClub) => {
    if (dialog.club?.id === club.id && dialog.type === "delete") {
      try {
        await serverAdminDeleteClub(club.id);
        setClubs(clubs.filter((c) => c.id !== club.id));
        setDialog({ type: null, club: null });
        toast.success("Club deleted successfully");
      } catch (error: any) {
        toast.error("Failed to delete club");
      }
    } else {
      setDialog({ type: "delete", club });
    }
  };

  const columns: TableColumn<AdminClub>[] = [
    {
      key: "name",
      label: "Club Name",
      icon: ICON_MAP.nav.clubs,
      render: (value, club) => {
        const iconKey = club.iconName as ClubIconKey;
        const icon = ALLOWED_ICON_MAP[iconKey] || ICON_MAP.nav.clubs;
        const color = CLUB_COLOR_HEX[club.mainColor as ClubColor] || CLUB_COLOR_HEX.BLUE;
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex size-8 items-center justify-center rounded-lg text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              <Icon icon={icon} className="size-4" />
            </div>
            <span className="font-medium">{String(value)}</span>
          </div>
        );
      },
    },
    { key: "ownerEmail", label: "Owner", icon: ICON_MAP.user.profile },
    {
      key: "status",
      label: "Status",
      icon: ICON_MAP.actions.status,
      render: (value) => (
        <StatusBadge type="club_status" value={value as string} />
      ),
    },
    {
      key: "createdAt",
      label: "Founded",
      icon: ICON_MAP.status.pending,
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setDialog({ type: "create", club: null })}>
          <span className="flex items-center gap-2">
            <Icon icon={ICON_MAP.actions.create} />
            Create Club
          </span>
        </Button>
      </div>
      <AdminTable
        data={clubs}
        columns={columns}
        searchKeys={["name", "ownerEmail"]}
        title="Clubs"
        actionButtons={() => [
          { label: "Change Status", action: "change_status" },
          { label: "Edit", action: "edit" },
          { label: "Delete", action: "delete" },
        ]}
        onRowAction={(club, action) => {
          if (action === "change_status") handleStatusChange(club);
          if (action === "edit") handleEditClub(club);
          if (action === "delete") handleDeleteClub(club);
        }}
      />

      <AlertDialog open={!!dialog.type}>
        <AlertDialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto my-6">
          {dialog.type === "status" && dialog.club && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Change Club Status</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="mt-4">
                    <Select
                      value={dialog.newStatus || ""}
                      onValueChange={(value) =>
                        setDialog({ ...dialog, newStatus: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setDialog({ type: null, club: null })}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => dialog.club && handleStatusChange(dialog.club)}
                >
                  Update
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {dialog.type === "create" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Create New Club</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-name">Club Name</Label>
                      <Input
                        id="create-name"
                        value={createForm.name}
                        onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                        placeholder="e.g. Debate Club"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-owner">Owner Email</Label>
                      <Input
                        id="create-owner"
                        value={createForm.ownerEmail}
                        onChange={(e) => setCreateForm({ ...createForm, ownerEmail: e.target.value })}
                        placeholder="user@aui.ma"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-desc">Description</Label>
                      <Input
                        id="create-desc"
                        value={createForm.description}
                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                        placeholder="Brief description of the club..."
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Club Color</Label>
                        <ColorPicker
                          value={createForm.mainColor}
                          onChange={(val) => setCreateForm({ ...createForm, mainColor: val })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Club Icon</Label>
                        <IconPicker
                          value={createForm.iconName}
                          onChange={(val) => setCreateForm({ ...createForm, iconName: val })}
                        />
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel onClick={() => setDialog({ type: null, club: null })}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateClub}>
                  Create
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {dialog.type === "edit" && dialog.club && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Club</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Club Name</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Club Color</Label>
                        <ColorPicker
                          value={editForm.mainColor}
                          onChange={(val) => setEditForm({ ...editForm, mainColor: val })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Club Icon</Label>
                        <IconPicker
                          value={editForm.iconName}
                          onChange={(val) => setEditForm({ ...editForm, iconName: val })}
                        />
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel onClick={() => setDialog({ type: null, club: null })}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => handleEditClub(dialog.club!)}>
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {dialog.type === "delete" && dialog.club && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Club?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. You are about to permanently delete the club "{dialog.club.name}" and all its associated posts and memberships.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDialog({ type: null, club: null })}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteClub(dialog.club!)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
