import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { DashboardSummary } from "@/features/dashboard/types";

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const { currency } = summary;

  const cards = [
    {
      title: "Total balance",
      value: summary.totalBalance,
      Icon: Wallet,
      valueClass: "text-foreground",
    },
    {
      title: "Money in this month",
      value: summary.monthlyDeposits,
      Icon: ArrowDownLeft,
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Money out this month",
      value: summary.monthlyWithdrawals,
      Icon: ArrowUpRight,
      valueClass: "text-foreground",
    },
  ];

  return (
    <section aria-label="Account summary">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, value, Icon, valueClass }) => (
          <li key={title}>
            <Card>
              <CardContent className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{title}</p>
                  <p
                    className={`truncate text-xl font-semibold tabular-nums ${valueClass}`}
                  >
                    {formatCurrency(value, currency)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
