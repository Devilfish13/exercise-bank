"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAsyncData } from "@/hooks/use-async-data";
import { getDashboard } from "@/features/dashboard/api";
import { SummaryCards } from "@/features/dashboard/components/summary-cards";
import { AccountsOverview } from "@/features/dashboard/components/accounts-overview";
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";

export function DashboardView() {
  const { data, error, isLoading, retry } = useAsyncData(getDashboard);

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
          <div>
            <p className="font-medium">We couldn&apos;t load your dashboard</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
          <Button variant="outline" onClick={retry}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <SummaryCards summary={data.summary} />
      <AccountsOverview accounts={data.accounts} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={data.recentTransactions} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
