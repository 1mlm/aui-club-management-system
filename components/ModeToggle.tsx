"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { ICON_MAP } from "@/lib/icon-map"
import { Icon } from "@/shadcn/cpns/Icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu"
import { SidebarMenuButton } from "@/shadcn/ui/sidebar"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton tooltip="Toggle Theme">
          <div className="relative flex items-center justify-center">
            <Icon icon={ICON_MAP.misc.sun} className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Icon icon={ICON_MAP.misc.moon} className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>
          <span>Theme</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
