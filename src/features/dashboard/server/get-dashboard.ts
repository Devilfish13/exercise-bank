import { findAccountsByUserId } from "@/features/accounts/server/account-store";
import { findTransactionsByAccountIds } from "@/features/transactions/server/transaction-store";
import { buildDashboard } from "@/features/dashboard/server/build-dashboard";
import type { DashboardData } from "@/features/dashboard/types";

export function getDashboardForUser(userId: string): DashboardData {
  const accounts = findAccountsByUserId(userId);
  const transactions = findTransactionsByAccountIds(
    accounts.map((account) => account.id),
  );
  return buildDashboard(accounts, transactions);
}
