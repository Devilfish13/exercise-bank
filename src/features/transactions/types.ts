export type TransactionType = "deposit" | "withdrawal" | "transfer";

export type TransactionStatus = "completed" | "pending";

export type Transaction = {
  id: string;
  accountId: string;
  type: TransactionType;
  description: string;
  counterparty?: string;
  /** Positive for money in, negative for money out. Major currency units. */
  amount: number;
  currency: string;
  status: TransactionStatus;
  /** ISO 8601 date string. */
  date: string;
};

export type TransactionSortBy = "date" | "amount";

export type SortOrder = "asc" | "desc";

export type TransactionQuery = {
  /** Caller must scope this to the authenticated user's own account IDs. */
  accountIds: string[];
  /** Optionally narrow to a single account within accountIds. */
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: TransactionSortBy;
  sortOrder?: SortOrder;
  /** 1-indexed. Defaults to 1. */
  page?: number;
  /** Defaults to 10. */
  pageSize?: number;
};

export type PaginatedTransactions = {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
