import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Transaction } from "@/features/transactions/types";

type TransactionListProps = {
  transactions: Transaction[];
  emptyMessage?: string;
  getHref?: (txn: Transaction) => string;
};

export function TransactionList({
  transactions,
  emptyMessage = "No transactions yet.",
  getHref,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {transactions.map((txn) => {
        const isCredit = txn.amount > 0;
        const inner = (
          <>
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-medium">
                <span className="truncate">{txn.description}</span>
                {txn.status === "pending" ? (
                  <Badge variant="outline" className="shrink-0">
                    Pending
                  </Badge>
                ) : null}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {txn.counterparty ? `${txn.counterparty} · ` : ""}
                {formatDate(txn.date)}
              </p>
            </div>
            <p
              className={`shrink-0 font-semibold tabular-nums ${
                isCredit
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-foreground"
              }`}
            >
              {isCredit ? "+" : ""}
              {formatCurrency(txn.amount, txn.currency)}
            </p>
          </>
        );

        const href = getHref?.(txn);

        return (
          <li key={txn.id}>
            {href ? (
              <Link
                href={href}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 hover:bg-muted/40 -mx-2 px-2 transition-colors"
              >
                {inner}
              </Link>
            ) : (
              <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
