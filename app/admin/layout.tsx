"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user?.isSystemAdmin) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage users, clubs, and join requests
        </p>
      </div>
      {children}
    </div>
  );
}
