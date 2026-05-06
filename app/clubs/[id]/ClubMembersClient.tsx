"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  serverUpdateClubMemberRole,
  serverUpdateClubMemberStatus,
} from "@/app/actions";
import { AdminTable, type TableColumn } from "@/components/AdminTable";
import { StatusBadge } from "@/components/StatusBadge";
import type { ClubMember } from "@/db/types";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import type { ClubColorStyles } from "@/util/clubStyles";

export function ClubMembersClient({
  initialMembers,
  clubId,
  currentUserRole,
  colorStyles,
}: {
  initialMembers: ClubMember[];
  clubId: number;
  currentUserRole: string;
  colorStyles: ClubColorStyles;
}) {
  const [members, setMembers] = useState(initialMembers);
  const canManage =
    currentUserRole === "owner" || currentUserRole === "board_member";

  const handleAction = async (member: ClubMember, action: string) => {
    try {
      if (action === "kick" || action === "ban") {
        const newStatus = action === "kick" ? "left" : "banned";
        await serverUpdateClubMemberStatus(clubId, member.user_id, newStatus);
        setMembers(members.filter((m) => m.user_id !== member.user_id));
        toast.success(
          `Member successfully ${action === "kick" ? "kicked" : "banned"}`,
        );
      }
      if (action === "promote" || action === "demote") {
        const newRole = action === "promote" ? "board_member" : "member";
        await serverUpdateClubMemberRole(clubId, member.user_id, newRole);
        setMembers(
          members.map((m) =>
            m.user_id === member.user_id
              ? { ...m, membership_role: newRole }
              : m,
          ),
        );
        toast.success(`Member successfully ${action}d`);
      }
    } catch (e) {
      console.error("Action error", e);
      toast.error("Failed to perform the requested action.");
    }
  };

  const columns: TableColumn<ClubMember>[] = [
    {
      key: "user_id",
      label: "ID",
      icon: ICON_MAP.nav.browse,
      render: (val) => (
        <span className="font-mono text-xs text-muted-foreground">
          #{String(val)}
        </span>
      ),
    },
    { key: "display_name", label: "Name", icon: ICON_MAP.nav.users },
    { key: "email", label: "Email", icon: ICON_MAP.user.mail },
    {
      key: "membership_role",
      label: "Role",
      icon: ICON_MAP.user.role,
      render: (val) => {
        if (val === "board_member") {
          return (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium"
              style={{
                backgroundColor: colorStyles.bg,
                color: colorStyles.text,
                borderColor: colorStyles.border,
              }}
            >
              <Icon icon={ICON_MAP.actions.admin} className="size-3" />
              <span>Board Member</span>
            </div>
          );
        }
        if (val === "member") {
          return (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium"
              style={{
                backgroundColor: colorStyles.bg,
                color: colorStyles.text,
                borderColor: colorStyles.border,
                opacity: 0.7,
              }}
            >
              <Icon icon={ICON_MAP.nav.users} className="size-3" />
              <span>Member</span>
            </div>
          );
        }
        return <StatusBadge type="membership_role" value={val as string} />;
      },
    },
    {
      key: "joined_at",
      label: "Joined",
      icon: ICON_MAP.status.pending,
      render: (val) => new Date(val as string).toLocaleDateString(),
    },
  ];

  return (
    <AdminTable
      data={members}
      columns={columns}
      searchKeys={["display_name", "email"]}
      title="Club Members"
      actionButtons={(member) => {
        if (!canManage) return [];
        const isBoard = member.membership_role === "board_member";
        if (isBoard && currentUserRole === "owner") {
          return [
            { label: "Demote", action: "demote", icon: ICON_MAP.actions.down },
            {
              label: "Kick",
              action: "kick",
              icon: ICON_MAP.actions.reject,
              className: "text-amber-600 hover:text-amber-600",
            },
          ];
        } else if (!isBoard) {
          return [
            { label: "Promote", action: "promote", icon: ICON_MAP.actions.up },
            {
              label: "Kick",
              action: "kick",
              icon: ICON_MAP.actions.reject,
              className: "text-amber-600 hover:text-amber-600",
            },
            {
              label: "Ban",
              action: "ban",
              icon: ICON_MAP.actions.delete,
              className: "text-destructive hover:text-destructive",
            },
          ];
        }
        return [];
      }}
      onRowAction={handleAction}
    />
  );
}
