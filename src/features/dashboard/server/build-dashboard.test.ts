import { buildDashboard } from "@/features/dashboard/server/build-dashboard";
import type { Account } from "@/features/accounts/types";
import type { Transaction } from "@/features/transactions/types";

const accounts: Account[] = [
  {
    id: "acc_current",
    userId: "u1",
    type: "current",
    name: "Current",
    accountNumber: "31926048",
    balance: 1000,
    availableBalance: 1000,
    currency: "GBP",
    status: "active",
  },
  {
    id: "acc_isa",
    userId: "u1",
    type: "isa",
    name: "ISA",
    accountNumber: "77410523",
    balance: 5000,
    availableBalance: 5000,
    currency: "GBP",
    status: "active",
  },
  {
    id: "acc_credit",
    userId: "u1",
    type: "credit",
    name: "Credit",
    accountNumber: "4539120000007821",
    balance: 200,
    availableBalance: 4800,
    creditLimit: 5000,
    currency: "GBP",
    status: "active",
  },
];

const transactions: Transaction[] = [
  makeTxn("t1", 3000, "2026-05-25T08:00:00.000Z"),
  makeTxn("t2", -100, "2026-05-24T08:00:00.000Z"),
  makeTxn("t3", -50, "2026-05-20T08:00:00.000Z"),
  // previous month — must be excluded from the monthly figures
  makeTxn("t4", -999, "2026-04-15T08:00:00.000Z"),
];

function makeTxn(id: string, amount: number, date: string): Transaction {
  return {
    id,
    accountId: "acc_current",
    type: amount > 0 ? "deposit" : "withdrawal",
    description: id,
    amount,
    currency: "GBP",
    status: "completed",
    date,
  };
}

describe("buildDashboard", () => {
  it("treats credit balances as owed in the total balance", () => {
    const { summary } = buildDashboard(accounts, transactions);
    // 1000 + 5000 - 200 = 5800
    expect(summary.totalBalance).toBe(5800);
  });

  it("computes monthly deposits and withdrawals for the latest month only", () => {
    const { summary } = buildDashboard(accounts, transactions);
    expect(summary.monthlyDeposits).toBe(3000);
    expect(summary.monthlyWithdrawals).toBe(150); // 100 + 50, April excluded
  });

  it("returns the five most recent transactions, newest first", () => {
    const many = Array.from({ length: 8 }, (_, i) =>
      makeTxn(`m${i}`, -10, `2026-05-${10 + i}T08:00:00.000Z`),
    );
    const { recentTransactions } = buildDashboard(accounts, many);
    expect(recentTransactions).toHaveLength(5);
    expect(recentTransactions[0].id).toBe("m7");
  });

  it("handles a user with no accounts or transactions", () => {
    const { summary, accounts: accs, recentTransactions } = buildDashboard(
      [],
      [],
    );
    expect(summary.totalBalance).toBe(0);
    expect(summary.monthlyDeposits).toBe(0);
    expect(accs).toHaveLength(0);
    expect(recentTransactions).toHaveLength(0);
  });
});
