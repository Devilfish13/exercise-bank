import type { Account } from "@/features/accounts/types";
import type { Transaction } from "@/features/transactions/types";
import type { DashboardData } from "@/features/dashboard/types";

const RECENT_LIMIT = 5;

function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7); // "YYYY-MM"
}

/**
 * Pure aggregation so it can be unit-tested without HTTP or the data stores.
 * Monthly figures are computed for the month of the most recent transaction,
 * so the dashboard always shows meaningful numbers regardless of "today".
 */
export function buildDashboard(
  accounts: Account[],
  transactions: Transaction[],
): DashboardData {
  const currency = accounts[0]?.currency ?? "GBP";

  const totalBalance = accounts.reduce((sum, account) => {
    return sum + (account.type === "credit" ? -account.balance : account.balance);
  }, 0);

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const referenceMonth = sorted[0] ? monthKey(sorted[0].date) : null;
  const inMonth = referenceMonth
    ? sorted.filter((txn) => monthKey(txn.date) === referenceMonth)
    : [];

  const monthlyDeposits = inMonth
    .filter((txn) => txn.amount > 0)
    .reduce((sum, txn) => sum + txn.amount, 0);

  const monthlyWithdrawals = inMonth
    .filter((txn) => txn.amount < 0)
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

  return {
    summary: {
      totalBalance: round2(totalBalance),
      monthlyDeposits: round2(monthlyDeposits),
      monthlyWithdrawals: round2(monthlyWithdrawals),
      currency,
    },
    accounts,
    recentTransactions: sorted.slice(0, RECENT_LIMIT),
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
