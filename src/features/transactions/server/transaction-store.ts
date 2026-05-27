import seedTransactions from "@/mocks/data/transactions.json";
import type { Transaction } from "@/features/transactions/types";

const transactions = seedTransactions as Transaction[];

function byDateDesc(a: Transaction, b: Transaction): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function findTransactionsByAccountIds(
  accountIds: string[],
): Transaction[] {
  const ids = new Set(accountIds);
  return transactions.filter((txn) => ids.has(txn.accountId)).sort(byDateDesc);
}

export function findTransactionById(id: string): Transaction | undefined {
  return transactions.find((txn) => txn.id === id);
}
