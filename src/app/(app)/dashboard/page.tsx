"use client";

import { useAuth } from "@/features/auth/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome{user ? `, ${user.fullName}` : ""}. Your dashboard is coming
        soon.
      </p>
    </div>
  );
}
