"use client";

import { useAuth } from "@/features/auth/auth-context";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(" ")[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s an overview of your money.
        </p>
      </header>
      <DashboardView />
    </div>
  );
}
