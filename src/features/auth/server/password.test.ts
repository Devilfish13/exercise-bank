import { hashPassword, verifyPassword } from "@/features/auth/server/password";

describe("password hashing", () => {
  it("verifies a correct password against its hash", () => {
    const hash = hashPassword("Password123!");
    expect(verifyPassword("Password123!", hash)).toBe(true);
  });

  it("rejects an incorrect password", () => {
    const hash = hashPassword("Password123!");
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("produces a unique salt per hash", () => {
    expect(hashPassword("Password123!")).not.toBe(hashPassword("Password123!"));
  });

  it("rejects a malformed stored hash", () => {
    expect(verifyPassword("Password123!", "not-a-valid-hash")).toBe(false);
  });
});
