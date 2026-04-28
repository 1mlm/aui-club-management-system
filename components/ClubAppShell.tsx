"use client";

import {
  DiscoverCircleIcon,
  LogoutIcon,
  Telescope01Icon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ClubBrowser } from "@/components/ClubBrowser";
import type { ClubRecord } from "@/db/types";
import { Icon } from "@/shadcn/cpns/Icon";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { Card } from "@/shadcn/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Separator } from "@/shadcn/ui/separator";

type ClubAppShellProps = {
  clubs: ClubRecord[];
};

export function ClubAppShell({ clubs }: ClubAppShellProps) {
  const [expanded, setExpanded] = useState(false);
  const { user, loading, signOut } = useAuth();

  const clubLabel = useMemo(() => {
    if (!user || user.clubCount < 1) {
      return "No Club";
    }

    if (user.clubCount === 1) {
      return "1 Club";
    }

    return `${user.clubCount} Clubs`;
  }, [user]);

  return (
    <div className="flex min-h-screen w-screen bg-background">
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={cn(
          "h-screen shrink-0 transition-[width] duration-300 ease-out",
          expanded ? "w-64" : "w-18",
        )}
      >
        <Card className="flex h-full rounded-none border-y-0 border-l-0 border-r bg-sidebar py-4 shadow-none">
          <div className="flex items-center gap-3 px-3">
            <span className="grid size-10 place-items-center rounded-xl bg-sidebar-accent">
              <Icon
                icon={Telescope01Icon}
                className="size-5 text-sidebar-foreground"
              />
            </span>
            <div
              className={cn(
                "flex min-w-0 flex-col overflow-hidden transition-all duration-200",
                expanded ? "opacity-100" : "w-0 opacity-0",
              )}
            >
              <span className="truncate text-sm font-semibold tracking-wide">
                AUI Clubs
              </span>
              <span className="truncate text-xs text-muted-foreground">
                v0.1
              </span>
            </div>
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-2 px-2">
            <Button
              variant="secondary"
              className={cn(
                "justify-start",
                !expanded && "justify-center px-0",
              )}
            >
              <Icon icon={DiscoverCircleIcon} />
              <span
                className={cn(
                  "transition-all",
                  expanded ? "opacity-100" : "w-0 opacity-0",
                )}
              >
                Browse
              </span>
            </Button>
          </nav>

          <Separator className="mb-3" />

          <div className="px-2">
            {loading ? (
              <div className="h-10 animate-pulse rounded-lg bg-sidebar-accent/50" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-auto w-full items-start gap-2 rounded-lg px-2 py-2",
                      !expanded && "justify-center px-0",
                    )}
                  >
                    <Icon
                      icon={User03Icon}
                      className="mt-0.5 size-5 shrink-0"
                    />
                    <span
                      className={cn(
                        "flex min-w-0 flex-col text-left transition-all",
                        expanded ? "opacity-100" : "w-0 opacity-0",
                      )}
                    >
                      <span className="truncate text-sm font-medium">
                        {user.displayName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {clubLabel}
                      </span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => {
                      void signOut();
                    }}
                  >
                    <Icon icon={LogoutIcon} />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                variant="outline"
                className={cn("w-full", !expanded && "justify-center px-0")}
              >
                <Link href="/auth">
                  <Icon icon={User03Icon} />
                  <span
                    className={cn(expanded ? "opacity-100" : "w-0 opacity-0")}
                  >
                    Log in
                  </span>
                </Link>
              </Button>
            )}
          </div>
        </Card>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 md:px-6">
          <ClubBrowser clubs={clubs} />
        </div>
      </main>
    </div>
  );
}
