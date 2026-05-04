import {
  Cancel01Icon,
  DiscoverCircleIcon,
  LogoutIcon,
  PaintBrush04Icon,
  SearchIcon,
  Telescope01Icon,
  Tick02Icon,
  User03Icon,
  UserIcon,
  X,
} from "@hugeicons/core-free-icons";
import type { Hugeicon } from "@/util/hugeicons";

export const ICON_MAP = {
  nav: {
    browse: DiscoverCircleIcon,
    queries: SearchIcon,
    admin: Telescope01Icon,
    users: UserIcon,
    clubs: DiscoverCircleIcon,
    joinRequests: User03Icon,
  },
  actions: {
    edit: PaintBrush04Icon,
    reset: PaintBrush04Icon,
    approve: Tick02Icon,
    reject: Cancel01Icon,
    delete: Cancel01Icon,
    admin: UserIcon,
    status: Telescope01Icon,
  },
  status: {
    success: Tick02Icon,
    error: Cancel01Icon,
    empty: X,
  },
  user: {
    profile: User03Icon,
    logout: LogoutIcon,
  },
  misc: {
    search: SearchIcon,
    close: X,
    logo: Telescope01Icon,
  },
} as const satisfies Record<string, Record<string, Hugeicon>>;
