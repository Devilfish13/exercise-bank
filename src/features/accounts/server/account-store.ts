import seedAccounts from "@/mocks/data/accounts.json";
import type { Account } from "@/features/accounts/types";

const accounts = seedAccounts as Account[];

export function findAccountsByUserId(userId: string): Account[] {
  return accounts.filter((account) => account.userId === userId);
}

export function findAccountById(id: string): Account | undefined {
  return accounts.find((account) => account.id === id);
}
