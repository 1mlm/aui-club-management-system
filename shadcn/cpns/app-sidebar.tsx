"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { useAuth } from "@/components/AuthProvider";
import { ALLOWED_ICON_MAP } from "@/db/catalog";
import { getClubColorStyles } from "@/util/clubStyles";
import type { MyClub } from "@/db/types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
} from "@/shadcn/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";

const BASE_NAV = [
  { title: "Browse Clubs", url: "/", icon: ICON_MAP.nav.browse },
  { title: "My Dashboard", url: "/dashboard", icon: ICON_MAP.nav.dashboard },
  { title: "SQL Simulator", url: "/queries", icon: ICON_MAP.nav.queries },
];

const ADMIN_NAV = [
  { title: "Users", url: "/admin/users", icon: ICON_MAP.nav.users },
  { title: "Clubs", url: "/admin/clubs", icon: ICON_MAP.nav.clubs },
  { title: "Join Requests", url: "/admin/joinrequests", icon: ICON_MAP.nav.joinRequests },
  { title: "Club Requests", url: "/admin/clubrequests", icon: ICON_MAP.nav.dashboard },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [myClubs, setMyClubs] = React.useState<MyClub[]>([]);

  React.useEffect(() => {
    if (!user) { setMyClubs([]); return; }
    fetch("/api/me/clubs", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setMyClubs(data.clubs ?? []))
      .catch(() => {});
  }, [user]);

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Icon icon={ICON_MAP.misc.logo} className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm">AUI Clubs</span>
                  <span className="text-xs text-muted-foreground">Database Studio</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {BASE_NAV.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive(item.url)}>
                  <Link href={item.url}>
                    <Icon icon={item.icon} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {user && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/create-club")}>
                    <Link href="/create-club">
                      <Icon icon={ICON_MAP.nav.clubs} />
                      <span>Create a Club</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}

        {user && myClubs.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>My Clubs</SidebarGroupLabel>
              <SidebarMenu>
                {myClubs.map((club) => {
                  const colorStyles = getClubColorStyles(club.color ?? undefined);
                  const icon = club.icon ? ALLOWED_ICON_MAP[club.icon] : ALLOWED_ICON_MAP.KNOWLEDGE;
                  const clubUrl = `/clubs/${club.id}`;
                  return (
                    <SidebarMenuItem key={club.id}>
                      <SidebarMenuButton asChild isActive={isActive(clubUrl)}>
                        <Link href={clubUrl}>
                          <span
                            className="flex size-4 items-center justify-center rounded-full shrink-0"
                            style={{ backgroundColor: colorStyles.bg, border: `1.5px solid ${colorStyles.border}` }}
                          >
                            <Icon icon={icon} className="size-2.5" style={{ color: colorStyles.text }} strokeWidth={2} />
                          </span>
                          <span className="truncate">{club.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}

        {user?.isSystemAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarMenu>
                {ADMIN_NAV.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url}>
                        <Icon icon={item.icon} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Icon icon={ICON_MAP.user.profile} className="size-4" />
                    <div className="flex flex-col gap-0.5 leading-none ml-1">
                      <span className="font-medium text-sm">{user.displayName}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.clubCount} {user.clubCount === 1 ? "Club" : "Clubs"}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard">
                      <Icon icon={ICON_MAP.nav.dashboard} />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onSelect={() => signOut()}>
                    <Icon icon={ICON_MAP.user.logout} />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !loading && !user ? (
              <SidebarMenuButton asChild size="lg">
                <Link href="/auth">
                  <Icon icon={ICON_MAP.user.profile} className="size-4" />
                  <div className="flex flex-col gap-0.5 leading-none ml-1">
                    <span className="font-medium text-sm">Log In</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            ) : null}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
