import { CreditCard, PiggyBank, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, maskAccountNumber } from "@/lib/format";
import type { Account, AccountType } from "@/features/accounts/types";

const TYPE_META: Record<AccountType, { label: string; Icon: LucideIcon }> = {
  current: { label: "Current account", Icon: Wallet },
  isa: { label: "Cash ISA", Icon: PiggyBank },
  credit: { label: "Credit card", Icon: CreditCard },
};

function statusVariant(status: Account["status"]) {
  if (status === "closed") return "destructive" as const;
  if (status === "frozen") return "outline" as const;
  return "secondary" as const;
}

export function AccountCard({ account }: { account: Account }) {
  const { label, Icon } = TYPE_META[account.type];
  const isCredit = account.type === "credit";

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="font-medium text-card-foreground">{account.name}</p>
            </div>
          </div>
          <Badge variant={statusVariant(account.status)} className="capitalize">
            {account.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-semibold tabular-nums">
          {formatCurrency(account.balance, account.currency)}
        </p>
        <p className="text-sm text-muted-foreground">
          {isCredit ? "Balance owed" : "Available balance"}
        </p>
        {isCredit && account.creditLimit !== undefined ? (
          <p className="pt-1 text-sm text-muted-foreground">
            {formatCurrency(account.availableBalance, account.currency)}{" "}
            available of {formatCurrency(account.creditLimit, account.currency)}
          </p>
        ) : null}
        <p className="pt-2 text-sm text-muted-foreground">
          {account.sortCode ? `Sort code ${account.sortCode} · ` : ""}
          {maskAccountNumber(account.accountNumber)}
        </p>
      </CardContent>
    </Card>
  );
}
