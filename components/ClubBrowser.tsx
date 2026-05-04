"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { ALLOWED_ICON_MAP } from "@/db/catalog";
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
  { value: "none", label: "None" },
  { value: "name_asc", label: "Ascending Name" },
  { value: "name_desc", label: "Descending Name" },
  { value: "created_asc", label: "Oldest" },
  { value: "created_desc", label: "Recently Created" },
];

export function ClubBrowser({ clubs }: ClubBrowserProps) {
  const [query, setQuery] = useQueryState("query", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "" });
  const sortValue = sort || "none";
  const isFilterActive = !!sort || !!query;

  const normalizedQuery = (query || "").trim().toLowerCase();

  const visibleClubs = useMemo(() => {
    let list = clubs;

    if (normalizedQuery) {
      list = list.filter(
        (club) =>
          club.name.toLowerCase().includes(normalizedQuery) ||
          (club.description || "").toLowerCase().includes(normalizedQuery),
      );
    }

    if (sort === "name_desc") {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "name_asc") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "created_desc") {
      list = [...list].sort((a, b) => b.id - a.id);
    } else if (sort === "created_asc") {
      list = [...list].sort((a, b) => a.id - b.id);
    }

    return list;
  }, [clubs, normalizedQuery, sort]);

  return (
    <div className="mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col items-center px-4 py-8 md:px-8">
      <div className="w-full flex gap-3 justify-center items-center">
        <InputGroup className="flex-1 max-w-2xl shadow-[0_0_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
          <InputGroupAddon>
            <Icon icon={ICON_MAP.misc.search} />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Search..."
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12"
          />
          {visibleClubs.length > 0 && normalizedQuery && (
            <InputGroupText className="text-muted-foreground pr-2">
              {visibleClubs.length} results
            </InputGroupText>
          )}
        </InputGroup>

        <Select
          value={sortValue}
          onValueChange={(v) => setSort(v === "none" ? "" : v)}
        >
          <SelectTrigger
            className={`w-40 h-10 ${isFilterActive ? "bg-primary text-primary-foreground" : ""}`}
          >
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFilterActive && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSort("");
              setQuery("");
            }}
            className="h-10 px-3"
          >
            <Icon icon={ICON_MAP.actions.reset} className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="mt-8 flex w-full flex-wrap justify-center gap-4 md:gap-6">
        {visibleClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>

      {normalizedQuery && visibleClubs.length === 0 ? (
        <p className="mt-8 text-muted-foreground flex flex-col items-center">
          <Icon icon={ICON_MAP.status.empty} className="size-12 mb-2" />
          No clubs match this search.
        </p>
      ) : null}
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
      style={{
        backgroundColor: colorStyles.bg,
        borderColor: colorStyles.border,
        boxShadow: `0 0 20px ${colorStyles.shadow}`,
        // @ts-expect-error
        "cornerShape": "squircle",
      }}
      className="flex w-full max-w-[24rem] gap-4 rounded-full border-3 p-4 transition-all duration-300 hover:cursor-pointer! active:scale-95 hover:-translate-y-2"
    >
      <div
        style={{
          backgroundColor: colorStyles.bg,
          borderColor: colorStyles.border,
          boxShadow: `0 0 20px ${colorStyles.shadow}`,
          // @ts-expect-error
          "cornerShape": "squircle",
        }}
        className="club-icon size-16 shrink-0 rounded-full border-3 flex items-center justify-center"
      >
        <div {...transitionProps.stageProps}>
          {outgoingIcon ? (
            <Icon
              key={`out-${club.id}-${transitionKey}`}
              icon={outgoingIcon}
              {...transitionProps.outgoingIconProps}
              style={{ color: colorStyles.text }}
              strokeWidth={1.5}
            />
          ) : null}
          <Icon
            key={`in-${club.id}-${transitionKey}`}
            icon={activeIcon}
            {...transitionProps.incomingIconProps}
            style={{ color: colorStyles.text }}
            strokeWidth={1.5}
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-semibold leading-tight">{club.name}</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {club.description}
        </p>
      </div>
    </Link>
  );
}
