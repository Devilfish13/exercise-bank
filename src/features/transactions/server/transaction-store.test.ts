import {
  findTransactionById,
  findTransactionsByAccountIds,
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
