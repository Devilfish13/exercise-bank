import {
  findAccountById,
  findAccountsByUserId,
} from "@/features/accounts/server/account-store";

describe("account store", () => {
  it("returns only the given user's accounts", () => {
    const accounts = findAccountsByUserId("usr_demo_0001");
    expect(accounts.length).toBeGreaterThan(0);
    expect(accounts.every((a) => a.userId === "usr_demo_0001")).toBe(true);
  });

  it("returns an empty list for an unknown user", () => {
    expect(findAccountsByUserId("nope")).toHaveLength(0);
  });

  it("finds an account by id and returns undefined otherwise", () => {
    expect(findAccountById("acc_isa_001")?.type).toBe("isa");
    expect(findAccountById("nope")).toBeUndefined();
  });
});
