import type { Account } from "@/features/accounts/types";
import type { Transaction } from "@/features/transactions/types";

export type DashboardSummary = {
  /** Net balance across accounts (deposits minus credit owed). */
  totalBalance: number;
  monthlyDeposits: number;
  monthlyWithdrawals: number;
  currency: string;
};

export type DashboardData = {
  summary: DashboardSummary;
  accounts: Account[];
  recentTransactions: Transaction[];
};
