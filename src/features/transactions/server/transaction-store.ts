import seedTransactions from "@/mocks/data/transactions.json";
import type {
  Transaction,
  TransactionQuery,
  PaginatedTransactions,
} from "@/features/transactions/types";

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

export function queryTransactions(query: TransactionQuery): PaginatedTransactions {
  const {
    accountIds,
    accountId,
    dateFrom,
    dateTo,
    sortBy = "date",
    sortOrder = "desc",
    page = 1,
    pageSize = 10,
  } = query;

  const allowedIds = new Set(accountIds);

  let result = transactions.filter((txn) => {
    if (!allowedIds.has(txn.accountId)) return false;
    if (accountId && txn.accountId !== accountId) return false;

    const txnTime = new Date(txn.date).getTime();
    if (dateFrom && txnTime < new Date(dateFrom).getTime()) return false;
    // dateTo is end-of-day inclusive: compare against start of next day
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setDate(endOfDay.getDate() + 1);
      if (txnTime >= endOfDay.getTime()) return false;
    }

    return true;
  });

  result.sort((a, b) => {
    let cmp = 0;
    if (sortBy === "amount") {
      cmp = a.amount - b.amount;
    } else {
      cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    transactions: result.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}
