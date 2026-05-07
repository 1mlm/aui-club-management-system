"use client";

import { useMemo, useState } from "react";
import type { AnalyticsData } from "@/db/analytics";
import type { ClubColor, ClubIconKey } from "@/db/catalog";
import { ALLOWED_ICON_MAP } from "@/db/catalog";
import type { ActivityLogEntry } from "@/db/types";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { cn } from "@/shadcn/lib/utils";
import { getClubColorStyles } from "@/util/clubStyles";

type ShowMode =
  | "members"
  | "posts"
  | "join_requests"
  | "club_requests"
  | "activity";
type DisplayMode = "bars" | "list" | "table";

const SHOW_OPTIONS: { value: ShowMode; label: string }[] = [
  { value: "members", label: "Members" },
  { value: "posts", label: "Posts" },
  { value: "join_requests", label: "Join Requests" },
  { value: "club_requests", label: "Club Requests" },
  { value: "activity", label: "Activity" },
];

const ACTION_LABELS: Record<string, string> = {
  post_created: "Post Created",
  post_deleted: "Post Deleted",
  post_pinned: "Post Pinned",
  post_unpinned: "Post Unpinned",
  join_approved: "Join Approved",
  join_rejected: "Join Rejected",
  join_waitlisted: "Join Waitlisted",
  club_created: "Club Approved",
};

const ACTION_COLORS: Record<string, string> = {
  post_created:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  post_deleted:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  post_pinned:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  post_unpinned:
    "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  join_approved:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  join_rejected:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  join_waitlisted:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  club_created:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

const STATUS_COLORS: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  approved:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  rejected:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  waitlisted:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
};

// ── Sub-views ────────────────────────────────────────────────────────────────

function ClubsView({
  clubs,
  metric,
  display,
}: {
  clubs: AnalyticsData["clubsByMembers"] | AnalyticsData["clubsByPosts"];
  metric: "members" | "posts";
  display: DisplayMode;
}) {
  const counts = clubs.map((c) =>
    "member_count" in c
      ? (c as { member_count: number }).member_count
      : (c as { post_count: number }).post_count,
  );
  const max = Math.max(...counts, 1);

  if (clubs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">No data.</p>
    );
  }

  if (display === "list") {
    return (
      <ol className="space-y-2">
        {clubs.map((club, i) => {
          const styles = getClubColorStyles(
            (club.color as ClubColor) ?? undefined,
          );
          const iconComp = club.icon
            ? ALLOWED_ICON_MAP[club.icon as ClubIconKey]
            : ALLOWED_ICON_MAP.KNOWLEDGE;
          const count = counts[i];
          return (
            <li key={club.club_id} className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground tabular-nums w-5 text-right shrink-0">
                {i + 1}.
              </span>
              <span
                className="flex size-6 items-center justify-center rounded-full shrink-0"
                style={{
                  backgroundColor: styles.bg,
                  border: `1.5px solid ${styles.border}`,
                }}
              >
                <Icon
                  icon={iconComp}
                  className="size-3.5"
                  style={{ color: styles.text }}
                  strokeWidth={2}
                />
              </span>
              <span className="font-medium truncate flex-1">{club.name}</span>
              <span className="tabular-nums text-muted-foreground font-mono text-xs">
                {count} {metric === "members" ? "members" : "posts"}
              </span>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="space-y-3">
      {clubs.map((club, i) => {
        const styles = getClubColorStyles(
          (club.color as ClubColor) ?? undefined,
        );
        const iconComp = club.icon
          ? ALLOWED_ICON_MAP[club.icon as ClubIconKey]
          : ALLOWED_ICON_MAP.KNOWLEDGE;
        const count = counts[i];
        const pct = Math.round((count / max) * 100);
        return (
          <div key={club.club_id} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="flex size-5 items-center justify-center rounded-full shrink-0"
                  style={{
                    backgroundColor: styles.bg,
                    border: `1.5px solid ${styles.border}`,
                  }}
                >
                  <Icon
                    icon={iconComp}
                    className="size-3"
                    style={{ color: styles.text }}
                    strokeWidth={2}
                  />
                </span>
                <span className="font-medium truncate max-w-40">
                  {club.name}
                </span>
              </div>
              <span className="text-muted-foreground tabular-nums text-xs">
                {count}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: styles.primary }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RequestStatsView({
  items,
  display,
}: {
  items: { key: string; value: number }[];
  display: DisplayMode;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No statuses selected.
      </p>
    );
  }

  if (display === "list") {
    return (
      <div className="flex flex-wrap gap-3">
        {items.map(({ key, value }) => (
          <div
            key={key}
            className={cn(
              "flex flex-col items-center px-5 py-4 rounded-xl border min-w-24",
              STATUS_COLORS[key] ?? "bg-muted text-foreground border-border",
            )}
          >
            <span className="text-2xl font-bold tabular-nums">{value}</span>
            <span className="text-xs font-medium capitalize mt-1">{key}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(({ key, value }) => {
        const pct = Math.round((value / max) * 100);
        const colorClass = STATUS_COLORS[key] ?? "";
        const barColor =
          key === "pending"
            ? "#d97706"
            : key === "approved"
              ? "#16a34a"
              : key === "rejected"
                ? "#dc2626"
                : key === "waitlisted"
                  ? "#ea580c"
                  : "#6b7280";
        return (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
                  colorClass,
                )}
              >
                {key}
              </span>
              <span className="text-muted-foreground tabular-nums text-xs">
                {value}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityView({
  items,
  display,
}: {
  items: ActivityLogEntry[];
  display: DisplayMode;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No activity matches the current filters.
      </p>
    );
  }

  if (display === "list") {
    return (
      <div className="space-y-2">
        {items.map((entry) => (
          <div
            key={entry.log_id}
            className="flex items-center gap-3 text-sm py-1"
          >
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium border shrink-0",
                ACTION_COLORS[entry.action] ??
                "bg-muted text-muted-foreground border-border",
              )}
            >
              {ACTION_LABELS[entry.action] ?? entry.action}
            </span>
            {entry.detail && (
              <span className="text-muted-foreground truncate flex-1 hidden sm:block">
                {entry.detail}
              </span>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-auto">
              {new Date(entry.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y -mx-5 -mb-5">
      {items.map((entry) => (
        <div
          key={entry.log_id}
          className="flex items-center justify-between px-5 py-3 text-sm hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium border shrink-0",
                ACTION_COLORS[entry.action] ??
                "bg-muted text-muted-foreground border-border",
              )}
            >
              {ACTION_LABELS[entry.action] ?? entry.action}
            </span>
            {entry.detail && (
              <span className="text-muted-foreground truncate max-w-48 hidden md:block">
                {entry.detail}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 shrink-0 text-muted-foreground ml-4">
            {entry.club_name && (
              <span className="hidden sm:block truncate max-w-28 text-xs">
                {entry.club_name}
              </span>
            )}
            {entry.actor_name && (
              <span className="hidden md:block truncate max-w-28 text-xs">
                {entry.actor_name}
              </span>
            )}
            <span className="text-xs whitespace-nowrap">
              {new Date(entry.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const [show, setShow] = useState<ShowMode>("members");
  const [display, setDisplay] = useState<DisplayMode>("bars");
  const [limit, setLimit] = useState<3 | 5 | 10>(5);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const showClubs = show === "members" || show === "posts";
  const showRequests = show === "join_requests" || show === "club_requests";
  const showActivity = show === "activity";

  const handleShowChange = (mode: ShowMode) => {
    setShow(mode);
    setActiveFilters([]);
    if (mode === "activity") setDisplay("table");
    else setDisplay("bars");
  };

  const toggleFilter = (f: string) =>
    setActiveFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );

  const clubsData = useMemo(() => {
    const src = show === "members" ? data.clubsByMembers : data.clubsByPosts;
    return src.slice(0, limit);
  }, [show, limit, data]);

  const filteredActivity = useMemo(() => {
    let items = data.recentActivity;
    if (dateFrom)
      items = items.filter((e) => new Date(e.created_at) >= new Date(dateFrom));
    if (dateTo)
      items = items.filter(
        (e) => new Date(e.created_at) <= new Date(`${dateTo}T23:59:59`),
      );
    if (activeFilters.length > 0)
      items = items.filter((e) => activeFilters.includes(e.action));
    return items;
  }, [data.recentActivity, dateFrom, dateTo, activeFilters]);

  const joinStats = useMemo(() => {
    const statuses = ["pending", "approved", "rejected", "waitlisted"] as const;
    const filtered =
      activeFilters.length > 0
        ? statuses.filter((s) => activeFilters.includes(s))
        : statuses;
    return filtered.map((s) => ({ key: s, value: data.joinRequestStats[s] }));
  }, [data.joinRequestStats, activeFilters]);

  const clubStats = useMemo(() => {
    const statuses = ["pending", "approved", "rejected"] as const;
    const filtered =
      activeFilters.length > 0
        ? statuses.filter((s) => activeFilters.includes(s))
        : statuses;
    return filtered.map((s) => ({ key: s, value: data.clubCreationStats[s] }));
  }, [data.clubCreationStats, activeFilters]);

  const filterOptions: { value: string; label: string; colorClass: string }[] =
    useMemo(() => {
      if (show === "join_requests") {
        return [
          {
            value: "pending",
            label: "Pending",
            colorClass: STATUS_COLORS.pending,
          },
          {
            value: "approved",
            label: "Approved",
            colorClass: STATUS_COLORS.approved,
          },
          {
            value: "rejected",
            label: "Rejected",
            colorClass: STATUS_COLORS.rejected,
          },
          {
            value: "waitlisted",
            label: "Waitlisted",
            colorClass: STATUS_COLORS.waitlisted,
          },
        ];
      }
      if (show === "club_requests") {
        return [
          {
            value: "pending",
            label: "Pending",
            colorClass: STATUS_COLORS.pending,
          },
          {
            value: "approved",
            label: "Approved",
            colorClass: STATUS_COLORS.approved,
          },
          {
            value: "rejected",
            label: "Rejected",
            colorClass: STATUS_COLORS.rejected,
          },
        ];
      }
      if (show === "activity") {
        return Object.entries(ACTION_LABELS).map(([value, label]) => ({
          value,
          label,
          colorClass:
            ACTION_COLORS[value] ??
            "bg-muted text-muted-foreground border-border",
        }));
      }
      return [];
    }, [show]);

  const displayModes: { value: any; icon: React.ReactNode; show: boolean }[] = [
    {
      value: "bars",
      icon: <Icon icon={ICON_MAP.nav.browse} className="size-3.5" />,
      show: showClubs || showRequests,
    },
    {
      value: "list",
      icon: <Icon icon={ICON_MAP.nav.users} className="size-3.5" />,
      show: true,
    },
    {
      value: "table",
      icon: <Icon icon={ICON_MAP.actions.status} className="size-3.5" />,
      show: showActivity,
    },
  ].filter((m) => m.show);

  const resultCount = showClubs
    ? clubsData.length
    : showActivity
      ? filteredActivity.length
      : show === "join_requests"
        ? joinStats.reduce((a, b) => a + b.value, 0)
        : clubStats.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-3">
      {/* Control bar */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        {/* Row 1: Show pills + display toggle + result count */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider shrink-0 mr-1">
            Show
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SHOW_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleShowChange(opt.value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                  show === opt.value
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              {resultCount} total
            </span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              {displayModes.map(({ value, icon }) => (
                <button
                  key={value}
                  onClick={() => setDisplay(value)}
                  className={cn(
                    "px-2.5 py-1.5 transition-colors",
                    display === value
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Contextual controls */}
        {(showClubs || showActivity || filterOptions.length > 0) && (
          <div className="flex flex-wrap items-start gap-x-4 gap-y-2 pt-1 border-t text-xs">
            {/* Limit selector (clubs only) */}
            {showClubs && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider">
                  Top
                </span>
                <div className="flex gap-1">
                  {([3, 5, 10] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => setLimit(n)}
                      className={cn(
                        "px-2 py-0.5 rounded-md border font-medium transition-colors",
                        limit === n
                          ? "bg-foreground text-background border-foreground"
                          : "bg-transparent text-muted-foreground border-border hover:border-foreground/40",
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Date range (activity only) */}
            {showActivity && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider">
                  Between
                </span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border rounded-md px-2 py-0.5 bg-background text-foreground"
                />
                <span className="text-muted-foreground">–</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border rounded-md px-2 py-0.5 bg-background text-foreground"
                />
                {(dateFrom || dateTo) && (
                  <button
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon icon={ICON_MAP.misc.close} className="size-3" />
                  </button>
                )}
              </div>
            )}

            {/* Filter pills */}
            {filterOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted-foreground font-semibold uppercase tracking-wider mr-0.5">
                  Filter
                </span>
                {filterOptions.map((opt) => {
                  const active = activeFilters.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleFilter(opt.value)}
                      className={cn(
                        "px-2.5 py-0.5 rounded-full font-medium border transition-all",
                        active
                          ? opt.colorClass
                          : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground opacity-50 hover:opacity-80",
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
                {activeFilters.length > 0 && (
                  <button
                    onClick={() => setActiveFilters([])}
                    className="text-muted-foreground hover:text-foreground ml-1"
                  >
                    <Icon icon={ICON_MAP.misc.close} className="size-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Visualization */}
      <div className="rounded-xl border bg-card p-5 min-h-48">
        {showClubs && (
          <ClubsView
            clubs={clubsData}
            metric={show as "members" | "posts"}
            display={display}
          />
        )}
        {show === "join_requests" && (
          <RequestStatsView items={joinStats} display={display} />
        )}
        {show === "club_requests" && (
          <RequestStatsView items={clubStats} display={display} />
        )}
        {showActivity && (
          <ActivityView items={filteredActivity} display={display} />
        )}
      </div>
    </div>
  );
}
