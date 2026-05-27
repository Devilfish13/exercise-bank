"use client";

import Link from "next/link";

import { ErrorState } from "@/components/feedback/error-state";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsyncData } from "@/hooks/use-async-data";
import { getAccounts } from "@/features/accounts/api";
import { AccountCard } from "@/features/accounts/components/account-card";

export function AccountsView() {
  const { data, error, isLoading, retry } = useAsyncData(getAccounts);

  if (isLoading) return <AccountsSkeleton />;

  if (error) {
    return (
      <ErrorState
        title="We couldn't load your accounts"
        message={error.message}
        onRetry={retry}
      />
    );
  }

  const accounts = data?.accounts ?? [];

  if (accounts.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
        You don&apos;t have any accounts yet.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {accounts.map((account) => (
        <li key={account.id}>
          <Link
            href={`/accounts/${account.id}`}
            aria-label={`View ${account.name}`}
            className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <AccountCard account={account} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function AccountsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-10 w-full" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
