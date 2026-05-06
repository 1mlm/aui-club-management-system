"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { ALLOWED_COLOR_VALUES, ALLOWED_ICON_MAP } from "@/db/catalog";
import type { ClubRecord } from "@/db/types";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { Button } from "@/shadcn/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/shadcn/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { getClubColorStyles } from "@/util/clubStyles";
import { toHugeiconList } from "@/util/hugeicons";
import { useDeterministicIconRotation } from "@/util/iconRotation";

type ClubBrowserProps = {
  clubs: ClubRecord[];
};

const FALLBACK_ICON = ALLOWED_ICON_MAP.KNOWLEDGE;

const SORT_OPTIONS = [
  { value: "none", label: "Default" },
  { value: "name_asc", label: "A → Z" },
  { value: "name_desc", label: "Z → A" },
  { value: "members_desc", label: "Most Members" },
  { value: "created_desc", label: "Newest" },
  { value: "created_asc", label: "Oldest" },
];

export function ClubBrowser({ clubs }: ClubBrowserProps) {
  const [query, setQuery] = useQueryState("query", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const [colorFilter, setColorFilter] = useQueryState("color", { defaultValue: "" });

  const sortValue = sort || "none";
  const isFilterActive = !!sort || !!query || !!colorFilter;
  const normalizedQuery = (query || "").trim().toLowerCase();

  const visibleClubs = useMemo(() => {
    let list = clubs;

    if (normalizedQuery) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(normalizedQuery) ||
          (c.description || "").toLowerCase().includes(normalizedQuery),
      );
    }

    if (colorFilter) {
      list = list.filter((c) => c.color === colorFilter);
    }

    if (sort === "name_desc") {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "name_asc") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "members_desc") {
      list = [...list].sort((a, b) => b.member_count - a.member_count);
    } else if (sort === "created_desc") {
      list = [...list].sort((a, b) => b.id - a.id);
    } else if (sort === "created_asc") {
      list = [...list].sort((a, b) => a.id - b.id);
    }

    return list;
  }, [clubs, normalizedQuery, sort, colorFilter]);

  const usedColors = useMemo(
    () => ALLOWED_COLOR_VALUES.filter((c) => clubs.some((club) => club.color === c)),
    [clubs],
  );

  return (
    <div className="space-y-6">
      {/* Search + Sort row */}
      <div className="flex gap-3 flex-wrap">
        <InputGroup className="flex-1 min-w-0 max-w-xl">
          <InputGroupAddon>
            <Icon icon={ICON_MAP.misc.search} className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Search clubs..."
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10"
          />
          {visibleClubs.length > 0 && normalizedQuery && (
            <InputGroupText className="text-muted-foreground pr-3 text-sm">
              {visibleClubs.length}
            </InputGroupText>
          )}
        </InputGroup>

        <Select value={sortValue} onValueChange={(v) => setSort(v === "none" ? "" : v)}>
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFilterActive && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setSort(""); setQuery(""); setColorFilter(""); }}
            className="h-10 px-3 gap-1.5"
          >
            <Icon icon={ICON_MAP.misc.close} className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Color filter chips */}
      {usedColors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {usedColors.map((color) => {
            const styles = getClubColorStyles(color);
            const isActive = colorFilter === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setColorFilter(isActive ? "" : color)}
                className="h-7 px-3 rounded-full text-xs font-medium border transition-all"
                style={{
                  backgroundColor: isActive ? styles.text : styles.bg,
                  borderColor: styles.border,
                  color: isActive ? "white" : styles.text,
                  boxShadow: isActive ? `0 0 10px ${styles.shadow}` : undefined,
                }}
              >
                {color.charAt(0) + color.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      )}

      {/* Club count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {visibleClubs.length} {visibleClubs.length === 1 ? "club" : "clubs"}
          {isFilterActive && ` (filtered from ${clubs.length})`}
        </p>
      </div>

      {/* Grid */}
      {visibleClubs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Icon icon={ICON_MAP.status.empty} className="size-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No clubs match your search.</p>
          <button
            type="button"
            onClick={() => { setQuery(""); setColorFilter(""); }}
            className="mt-3 text-sm text-primary underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function ClubCard({ club }: { club: ClubRecord }) {
  const colorStyles = getClubColorStyles(club.color ?? undefined);
  const icon = club.icon ? ALLOWED_ICON_MAP[club.icon] : FALLBACK_ICON;
  const iconValues = useMemo(() => toHugeiconList(icon), [icon]);
  const { activeIcon, outgoingIcon, transitionKey, transitionProps } =
    useDeterministicIconRotation(iconValues, club.id);

  return (
    <Link
      href={`/clubs/${club.id}`}
      className="group flex flex-col rounded-2xl border p-5 gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95"
      style={{
        backgroundColor: colorStyles.bg,
        borderColor: colorStyles.border,
        boxShadow: `0 2px 12px ${colorStyles.shadow}`,
      }}
    >
      {/* Icon + member count row */}
      <div className="flex items-center justify-between">
        <div
          className="size-12 rounded-xl border-2 flex items-center justify-center shrink-0"
          style={{ borderColor: colorStyles.border, backgroundColor: colorStyles.bg }}
        >
          <div {...transitionProps.stageProps}>
            {outgoingIcon && (
              <Icon
                key={`out-${club.id}-${transitionKey}`}
                icon={outgoingIcon}
                {...transitionProps.outgoingIconProps}
                style={{ color: colorStyles.text }}
                strokeWidth={1.5}
              />
            )}
            <Icon
              key={`in-${club.id}-${transitionKey}`}
              icon={activeIcon}
              {...transitionProps.incomingIconProps}
              style={{ color: colorStyles.text }}
              strokeWidth={1.5}
            />
          </div>
        </div>

        <span
          className="text-xs font-medium px-2 py-1 rounded-full border"
          style={{ borderColor: colorStyles.border, color: colorStyles.text, backgroundColor: colorStyles.bg }}
        >
          {club.member_count} {club.member_count === 1 ? "member" : "members"}
        </span>
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-semibold text-base leading-snug line-clamp-1">{club.name}</h2>
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded border shrink-0"
            style={{ borderColor: colorStyles.border, color: colorStyles.text, backgroundColor: colorStyles.bg }}
          >
            #{club.id}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {club.description || "No description provided."}
        </p>
      </div>

      {/* Footer */}
      <div
        className="text-xs font-medium flex items-center gap-1 mt-auto"
        style={{ color: colorStyles.text }}
      >
        <Icon icon={ICON_MAP.nav.browse} className="size-3.5" />
        View club
      </div>
    </Link>
  );
}
