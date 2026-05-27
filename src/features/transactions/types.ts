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
