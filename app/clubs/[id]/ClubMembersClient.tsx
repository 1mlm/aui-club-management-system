"use client";

import { useState } from "react";
import { AdminTable, type TableColumn } from "@/components/AdminTable";
import { serverUpdateClubMemberStatus, serverUpdateClubMemberRole } from "@/app/actions";
import { ICON_MAP } from "@/lib/icon-map";
import type { ClubMember } from "@/db/types";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";

export function ClubMembersClient({ initialMembers, clubId, currentUserRole }: { initialMembers: ClubMember[], clubId: number, currentUserRole: string }) {
  const [members, setMembers] = useState(initialMembers);
  const canManage = currentUserRole === "owner" || currentUserRole === "board_member";

  const handleAction = async (member: ClubMember, action: string) => {
      try {
          if (action === "kick" || action === "ban") {
               const newStatus = action === "kick" ? "left" : "banned";
               await serverUpdateClubMemberStatus(clubId, member.user_id, newStatus);
               setMembers(members.filter(m => m.user_id !== member.user_id));
               toast.success(`Member successfully ${action === "kick" ? "kicked" : "banned"}`);
          }
          if (action === "promote" || action === "demote") {
               const newRole = action === "promote" ? "board_member" : "member";
               await serverUpdateClubMemberRole(clubId, member.user_id, newRole);
               setMembers(members.map(m => m.user_id === member.user_id ? { ...m, membership_role: newRole } : m));
               toast.success(`Member successfully ${action}d`);
          }
      } catch (e) {
          console.error("Action error", e);
          toast.error("Failed to perform the requested action.");
      }
  };

  const columns: TableColumn<ClubMember>[] = [
      { key: "display_name", label: "Name", icon: ICON_MAP.nav.users },
      { key: "email", label: "Email", icon: ICON_MAP.user.profile },
      { 
        key: "membership_role", 
        label: "Role", 
        icon: ICON_MAP.actions.admin,
        render: (val) => <StatusBadge type="membership_role" value={val as string} />
      },
      { 
        key: "joined_at", 
        label: "Joined", 
        icon: ICON_MAP.status.pending,
        render: (val) => new Date(val as string).toLocaleDateString() 
      }
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
                     { label: "Demote", action: "demote", icon: ICON_MAP.actions.status },
                     { label: "Kick", action: "kick", icon: ICON_MAP.actions.reject, className: "text-amber-600 hover:text-amber-600" },
                ];
            } else if (!isBoard) {
                return [
                     { label: "Promote", action: "promote", icon: ICON_MAP.actions.approve },
                     { label: "Kick", action: "kick", icon: ICON_MAP.actions.reject, className: "text-amber-600 hover:text-amber-600" },
                     { label: "Ban", action: "ban", icon: ICON_MAP.actions.delete, className: "text-destructive hover:text-destructive" }
                ];
            }
            return [];
        }}
        onRowAction={handleAction}
      />
  )
}
