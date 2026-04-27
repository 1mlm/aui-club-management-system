"use client";

import { SearchIcon } from "@hugeicons/core-free-icons";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { ALLOWED_ICON_MAP } from "@/db/catalog";
import type { ClubRecord } from "@/db/types";
import { Icon } from "@/shadcn/cpns/Icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/shadcn/ui/input-group";
import { getClubColorStyles } from "@/util/clubStyles";
import { toHugeiconList } from "@/util/hugeicons";
import { useDeterministicIconRotation } from "@/util/iconRotation";

type ClubBrowserProps = {
  clubs: ClubRecord[];
};

const FALLBACK_ICON = ALLOWED_ICON_MAP.KNOWLEDGE;

export function ClubBrowser({ clubs }: ClubBrowserProps) {
  const [query, setQuery] = useQueryState("query", { defaultValue: "" });

  const normalizedQuery = (query || "").trim().toLowerCase();

  const visibleClubs = useMemo(() => {
    if (!normalizedQuery) {
      return clubs;
    }
    return clubs.filter(
      (club) =>
        club.name.toLowerCase().includes(normalizedQuery) ||
        (club.description || "").toLowerCase().includes(normalizedQuery),
    );
  }, [clubs, normalizedQuery]);

  return (
    <div className="mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col items-center px-4 py-8 md:px-8">
      <div className="w-3/4 max-w-[42rem] md:w-full">
        <InputGroup className="w-full shadow-[0_0_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
          <InputGroupAddon>
            <Icon icon={SearchIcon} />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Search..."
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
          />
          {visibleClubs.length > 0 && normalizedQuery && (
            <InputGroupText className="text-muted-foreground pr-2">
              {visibleClubs.length} results
            </InputGroupText>
          )}
        </InputGroup>
      </div>

      <div className="mt-8 flex w-full flex-wrap justify-center gap-4 md:gap-6">
        {visibleClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>

      {normalizedQuery && visibleClubs.length === 0 ? (
        <p className="mt-8 text-muted-foreground">no clubs match this search.</p>
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
    <div
      style={{
        backgroundColor: colorStyles.bg,
        borderColor: colorStyles.border,
        boxShadow: `0 0 20px ${colorStyles.shadow}`,
      }}
      className="flex w-full max-w-[24rem] gap-4 rounded-3xl corner-shape-squircle border-3 p-4 transition-all duration-300 hover:-translate-y-1"
    >
      <div
        style={{
          backgroundColor: colorStyles.bg,
          borderColor: colorStyles.border,
          boxShadow: `0 0 20px ${colorStyles.shadow}`,
        }}
        className="club-icon size-16 shrink-0 corner-shape-squircle border-3 flex items-center justify-center"
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
        <h2 className="text-xl font-semibold leading-tight">{club.name} Club</h2>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {club.description}
        </p>
      </div>
    </div>
  );
}
