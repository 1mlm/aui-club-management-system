"use client";

import { redirect, usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/shadcn/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    redirect("/auth");
  }

  if (!user.isSystemAdmin) {
    redirect("/");
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen">
      <div className="border-b bg-muted/50 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, clubs, and join requests
          </p>
        </div>
      </div>
      <nav className="border-b bg-muted/25">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-6">
          <a
            href="/admin/users"
            className={cn(
              "py-4 px-0 border-b-2 transition-colors",
              isActive("/admin/users")
                ? "border-foreground"
                : "border-transparent hover:border-foreground/50",
            )}
          >
            Users
          </a>
          <a
            href="/admin/clubs"
            className={cn(
              "py-4 px-0 border-b-2 transition-colors",
              isActive("/admin/clubs")
                ? "border-foreground"
                : "border-transparent hover:border-foreground/50",
            )}
          >
            Clubs
          </a>
          <a
            href="/admin/joinrequests"
            className={cn(
              "py-4 px-0 border-b-2 transition-colors",
              isActive("/admin/joinrequests")
                ? "border-foreground"
                : "border-transparent hover:border-foreground/50",
            )}
          >
            Join Requests
          </a>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">{children}</div>
    </div>
  );
}
