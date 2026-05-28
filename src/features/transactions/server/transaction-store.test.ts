import {
  findTransactionById,
  findTransactionsByAccountIds,
  queryTransactions,
} from "@/features/transactions/server/transaction-store";

describe("transaction store", () => {
  it("returns only transactions for the given accounts", () => {
    const txns = findTransactionsByAccountIds(["acc_current_001"]);
    expect(txns.length).toBeGreaterThan(0);
    expect(txns.every((t) => t.accountId === "acc_current_001")).toBe(true);
  });

  it("sorts transactions newest first", () => {
    const txns = findTransactionsByAccountIds([
      "acc_current_001",
      "acc_isa_001",
      "acc_credit_001",
    ]);
    for (let i = 1; i < txns.length; i += 1) {
      expect(new Date(txns[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(txns[i].date).getTime(),
      );
    }
  });

  it("finds a transaction by id and returns undefined otherwise", () => {
    expect(findTransactionById("txn_0001")?.description).toBe("Salary");
    expect(findTransactionById("nope")).toBeUndefined();
  });
});

describe("queryTransactions", () => {
  const allUserAccounts = ["acc_current_001", "acc_isa_001", "acc_credit_001"];

  it("returns only transactions belonging to the allowed account ids", () => {
    const { transactions } = queryTransactions({
      accountIds: ["acc_isa_001"],
    });
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions.every((t) => t.accountId === "acc_isa_001")).toBe(true);
  });

  it("filters by a specific accountId within allowed accounts", () => {
    const { transactions } = queryTransactions({
      accountIds: allUserAccounts,
      accountId: "acc_credit_001",
    });
    expect(transactions.every((t) => t.accountId === "acc_credit_001")).toBe(
      true,
    );
  });

  it("filters by dateFrom (inclusive)", () => {
    const { transactions } = queryTransactions({
      accountIds: allUserAccounts,
      dateFrom: "2026-05-01",
    });
    expect(transactions.length).toBeGreaterThan(0);
    transactions.forEach((t) => {
      expect(new Date(t.date).getTime()).toBeGreaterThanOrEqual(
        new Date("2026-05-01").getTime(),
      );
    });
  });

  it("filters by dateTo (end-of-day inclusive)", () => {
    const { transactions } = queryTransactions({
      accountIds: allUserAccounts,
      dateTo: "2026-03-31",
    });
    expect(transactions.length).toBeGreaterThan(0);
    transactions.forEach((t) => {
      expect(new Date(t.date).getTime()).toBeLessThan(
        new Date("2026-04-01").getTime(),
      );
    });
  });

  it("sorts by amount ascending", () => {
    const { transactions } = queryTransactions({
      accountIds: allUserAccounts,
      sortBy: "amount",
      sortOrder: "asc",
      pageSize: 100,
    });
    for (let i = 1; i < transactions.length; i++) {
      expect(transactions[i - 1].amount).toBeLessThanOrEqual(
        transactions[i].amount,
      );
    }
  });

  it("sorts by date descending by default", () => {
    const { transactions } = queryTransactions({
      accountIds: allUserAccounts,
      pageSize: 100,
    });
    for (let i = 1; i < transactions.length; i++) {
      expect(
        new Date(transactions[i - 1].date).getTime(),
      ).toBeGreaterThanOrEqual(new Date(transactions[i].date).getTime());
    }
  });

  it("paginates correctly", () => {
    const page1 = queryTransactions({
      accountIds: allUserAccounts,
      page: 1,
      pageSize: 5,
    });
    const page2 = queryTransactions({
      accountIds: allUserAccounts,
      page: 2,
      pageSize: 5,
    });

    expect(page1.transactions).toHaveLength(5);
    expect(page1.page).toBe(1);
    expect(page1.pageSize).toBe(5);
    expect(page1.totalPages).toBeGreaterThan(1);

    const page1Ids = new Set(page1.transactions.map((t) => t.id));
    page2.transactions.forEach((t) => expect(page1Ids.has(t.id)).toBe(false));
  });

  it("clamps page to totalPages when out of range", () => {
    const result = queryTransactions({
      accountIds: allUserAccounts,
      page: 9999,
      pageSize: 10,
    });
    expect(result.page).toBe(result.totalPages);
  });

  it("returns total count across all pages", () => {
    const { total } = queryTransactions({
      accountIds: allUserAccounts,
      pageSize: 5,
    });
    const all = queryTransactions({ accountIds: allUserAccounts, pageSize: 100 });
    expect(total).toBe(all.transactions.length);
  });
});
