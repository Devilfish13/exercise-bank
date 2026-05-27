import { apiFetch } from "@/lib/api/client";
import type { Account, AccountDetail } from "@/features/accounts/types";

export function getAccounts() {
  return apiFetch<{ accounts: Account[] }>("/api/accounts");
}

export function getAccount(id: string) {
  return apiFetch<AccountDetail>(`/api/accounts/${id}`);
}
