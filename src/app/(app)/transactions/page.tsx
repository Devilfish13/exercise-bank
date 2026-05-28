"use client";

import { Suspense } from "react";

import { TransactionsView } from "@/features/transactions/components/transactions-view";

export default function TransactionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Transactions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Search and filter your transaction history.
        </p>
      </header>
      <Suspense>
        <TransactionsView />
      </Suspense>
    </div>
  );
}
