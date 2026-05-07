"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth");
      return;
    }
    if (!user.isSystemAdmin) {
      router.replace("/");
    }
  }, [loading, router, user]);

  // While loading, render children dimmed so server-rendered content appears
  // immediately and doesn't get stuck behind an infinite spinner.
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse pointer-events-none opacity-50">
        {children}
      </div>
    );
  }

  if (!user?.isSystemAdmin) {
    return null;
  }

  return <div className="space-y-4">{children}</div>;
}
