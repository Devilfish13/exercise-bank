export type AccountType = "current" | "isa" | "credit";

export type AccountStatus = "active" | "frozen" | "closed";

export type Account = {
  id: string;
  userId: string;
  type: AccountType;
  name: string;
  /** Stored full; masked to the last 4 digits in the UI. */
  accountNumber: string;
  /** UK sort code, shown for deposit accounts. */
  sortCode?: string;
  /** For deposit accounts: money held. For credit: balance owed. */
  balance: number;
  /** Spendable amount. For credit: remaining credit. */
  availableBalance: number;
  /** Credit accounts only. */
  creditLimit?: number;
  currency: string;
  status: AccountStatus;
};
