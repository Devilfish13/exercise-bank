import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Transaction } from "@/features/transactions/types";

export function RecentTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No transactions yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map((txn) => {
              const isCredit = txn.amount > 0;
              return (
                <li
                  key={txn.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
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
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
