"use client";

import { ErrorState } from "@/components/feedback/error-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import { useAsyncData } from "@/hooks/use-async-data";
import { getAccount } from "@/features/accounts/api";
import { AccountCard } from "@/features/accounts/components/account-card";
import { TransactionList } from "@/features/transactions/components/transaction-list";

export function AccountDetail({ accountId }: { accountId: string }) {
  const { data, error, isLoading, retry } = useAsyncData(() =>
    getAccount(accountId),
  );

  if (isLoading) return <AccountDetailSkeleton />;

  if (error) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <ErrorState
        title={notFound ? "Account not found" : "We couldn't load this account"}
        message={
          notFound
            ? "This account doesn't exist or isn't available to you."
            : error.message
        }
        onRetry={notFound ? undefined : retry}
      />
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <AccountCard account={data.account} />
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList
            transactions={data.transactions}
            emptyMessage="No transactions for this account yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}

function AccountDetailSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <Card>
        <CardHeader>
          <Skeleton className="h-10 w-full" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-3 py-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
