"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { useAsyncData } from "@/hooks/use-async-data";
import { getTransaction } from "@/features/transactions/api";
import { formatCurrency, formatDate } from "@/lib/format";
import { ApiError } from "@/lib/api/client";

type TransactionDetailProps = {
  id: string;
};

export function TransactionDetail({ id }: TransactionDetailProps) {
  const { data, error, isLoading, retry } = useAsyncData(() =>
    getTransaction(id),
  );

  if (isLoading) return <DetailSkeleton />;

  if (error) {
    const is404 = error instanceof ApiError && error.status === 404;
    return (
      <ErrorState
        title={is404 ? "Transaction not found" : "Could not load transaction"}
        message={
          is404
            ? "This transaction doesn't exist or doesn't belong to your account."
            : error.message
        }
        onRetry={is404 ? undefined : retry}
      />
    );
  }

  const txn = data?.transaction;
  if (!txn) return null;

  const isCredit = txn.amount > 0;

  const rows: { label: string; value: string }[] = [
    { label: "Date", value: formatDate(txn.date) },
    { label: "Type", value: txn.type.charAt(0).toUpperCase() + txn.type.slice(1) },
    { label: "Account", value: txn.accountId },
    ...(txn.counterparty ? [{ label: "Counterparty", value: txn.counterparty }] : []),
    { label: "Reference", value: txn.id },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/transactions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to transactions
      </Link>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{txn.description}</h2>
              {txn.counterparty ? (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {txn.counterparty}
                </p>
              ) : null}
            </div>
            <Badge variant={txn.status === "pending" ? "outline" : "secondary"}>
              {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p
            className={`text-3xl font-bold tabular-nums ${
              isCredit
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-foreground"
            }`}
          >
            {isCredit ? "+" : ""}
            {formatCurrency(txn.amount, txn.currency)}
          </p>

          <dl className="divide-y divide-border rounded-lg border border-border">
            {rows.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <Skeleton className="h-4 w-36" />
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-9 w-32" />
          <div className="space-y-px rounded-lg border border-border overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3"
              >
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
