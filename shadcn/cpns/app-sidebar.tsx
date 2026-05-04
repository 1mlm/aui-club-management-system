"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ICON_MAP } from "@/lib/icon-map";
import { Icon } from "@/shadcn/cpns/Icon";
import { useAuth } from "@/components/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
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
  { title: "SQL Simulator", url: "/queries", icon: ICON_MAP.nav.queries },
];

const ADMIN_NAV = [
  { title: "Users", url: "/admin/users", icon: ICON_MAP.nav.users },
  { title: "Clubs", url: "/admin/clubs", icon: ICON_MAP.nav.clubs },
  { title: "Join Requests", url: "/admin/joinrequests", icon: ICON_MAP.nav.joinRequests },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  
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

        {user?.isSystemAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
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
                  <DropdownMenuItem 
                    className="cursor-pointer" 
                    onSelect={() => window.dispatchEvent(new Event('start-tour'))}
                  >
                    <Icon icon={ICON_MAP.nav.browse} />
                    <span>Take Tour</span>
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
