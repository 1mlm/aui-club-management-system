"use client";

import React from "react";
import { Icon } from "@/shadcn/cpns/Icon";
import { ICON_MAP } from "@/lib/icon-map";
import { cn } from "@/shadcn/lib/utils";
import type { Hugeicon } from "@/util/hugeicons";

type BadgeConfig = {
  label: string;
  icon: Hugeicon;
  className: string;
};

const CONFIG_MAP: Record<string, Record<string, BadgeConfig>> = {
  club_status: {
    active: {
      label: "Active",
      icon: ICON_MAP.status.success,
      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    deleted: {
      label: "Deleted",
      icon: ICON_MAP.status.error,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    archived: {
      label: "Archived",
      icon: ICON_MAP.actions.status,
      className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },
  },
  membership_status: {
    active: {
      label: "Member",
      icon: ICON_MAP.status.success,
      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    pending: {
      label: "Pending",
      icon: ICON_MAP.status.pending,
      className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    rejected: {
      label: "Rejected",
      icon: ICON_MAP.status.error,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    left: {
      label: "Left",
      icon: ICON_MAP.actions.leave,
      className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },
    banned: {
      label: "Banned",
      icon: ICON_MAP.status.error,
      className: "bg-red-600/10 text-red-600 border-red-600/20",
    },
  },
  membership_role: {
    board_member: {
      label: "Board Member",
      icon: ICON_MAP.actions.admin,
      className: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    },
    member: {
      label: "Member",
      icon: ICON_MAP.nav.users,
      className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },
  },
  join_request_status: {
    pending: {
      label: "Pending",
      icon: ICON_MAP.status.pending,
      className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    approved: {
      label: "Approved",
      icon: ICON_MAP.status.success,
      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    rejected: {
      label: "Rejected",
      icon: ICON_MAP.status.error,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  },
  admin_status: {
    true: {
      label: "Admin",
      icon: ICON_MAP.actions.admin,
      className: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    },
    false: {
      label: "User",
      icon: ICON_MAP.nav.users,
      className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },
  },
};

type StatusBadgeProps = {
  type: keyof typeof CONFIG_MAP;
  value: string | boolean;
  className?: string;
};

export function StatusBadge({ type, value, className }: StatusBadgeProps) {
  const strValue = String(value);
  const config = CONFIG_MAP[type]?.[strValue];

  if (!config) {
    return <span className={cn("text-sm", className)}>{strValue}</span>;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon icon={config.icon} className="size-3" />
      <span>{config.label}</span>
    </div>
  );
}
