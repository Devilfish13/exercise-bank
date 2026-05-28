"use client";

import { use } from "react";

import { TransactionDetail } from "@/features/transactions/components/transaction-detail";

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <TransactionDetail id={id} />
    </div>
  );
}
