"use client";

import { useState } from "react";
import { serverGetUserProfile } from "@/app/actions";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { ALLOWED_ICON_MAP, CLUB_COLOR_HEX, type ClubColor, type ClubIconKey } from "@/db/catalog";
import { getClubColorStyles } from "@/util/clubStyles";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shadcn/ui/sheet";
import type { AuthUser } from "@/db/auth-types";
import type { MyClub } from "@/db/types";

type UserProfileSheetProps = {
  userId: number;
  userName: string;
  trigger: React.ReactNode;
};

const ROLE_LABEL: Record<string, string> = {
  owner: "Owner",
  board_member: "Board",
  member: "Member",
};

export function UserProfileSheet({ userId, userName, trigger }: UserProfileSheetProps) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<{ user: AuthUser; clubs: MyClub[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = async (next: boolean) => {
    setOpen(next);
    if (next && !profile) {
      setLoading(true);
      try {
        const data = await serverGetUserProfile(userId);
        setProfile(data);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <span
        role="button"
        tabIndex={0}
        className="cursor-pointer underline-offset-2 hover:underline"
        onClick={() => handleOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && handleOpen(true)}
      >
        {trigger}
      </span>

      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Icon icon={ICON_MAP.user.profile} className="size-4 text-muted-foreground" />
            {userName}
          </SheetTitle>
          <SheetDescription>
            User profile &amp; club memberships
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 py-5 space-y-6">
          {loading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          )}

          {!loading && profile && (
            <>
              {/* Identity */}
              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Identity
                </h3>
                <div className="rounded-xl border divide-y text-sm">
                  <Row label="User ID">
                    <span className="font-mono">#{profile.user.id}</span>
                  </Row>
                  <Row label="Display Name">{profile.user.displayName}</Row>
                  <Row label="Email">{profile.user.email}</Row>
                  <Row label="Role">
                    {profile.user.isSystemAdmin ? (
                      <span className="text-xs font-medium bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                        System Admin
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Regular User</span>
                    )}
                  </Row>
                </div>
              </section>

              {/* Clubs */}
              <section className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Clubs ({profile.clubs.length})
                </h3>
                {profile.clubs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Not a member of any club.</p>
                ) : (
                  <div className="space-y-2">
                    {profile.clubs.map((club) => {
                      const colorStyles = getClubColorStyles(club.color ?? undefined);
                      const iconKey = club.icon as ClubIconKey | null;
                      const icon = iconKey ? ALLOWED_ICON_MAP[iconKey] : ICON_MAP.nav.clubs;
                      return (
                        <div
                          key={club.id}
                          className="flex items-center gap-3 rounded-xl border p-3"
                          style={{ backgroundColor: colorStyles.bg, borderColor: colorStyles.border }}
                        >
                          <div
                            className="size-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: colorStyles.bg, borderColor: colorStyles.border, border: `1.5px solid ${colorStyles.border}` }}
                          >
                            <Icon icon={icon} className="size-4" style={{ color: colorStyles.text }} strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{club.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">ID #{club.id}</p>
                          </div>
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full border shrink-0"
                            style={{ borderColor: colorStyles.border, color: colorStyles.text, backgroundColor: colorStyles.bg }}
                          >
                            {ROLE_LABEL[club.role] ?? club.role}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}

          {!loading && !profile && (
            <p className="text-sm text-muted-foreground">User not found.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}
