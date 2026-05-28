import { apiFetch } from "@/lib/api/client";
import type {
  Transaction,
  PaginatedTransactions,
  TransactionSortBy,
  SortOrder,
} from "@/features/transactions/types";

export type TransactionParams = {
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: TransactionSortBy;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
};

export function getTransactions(params: TransactionParams = {}) {
  const query = new URLSearchParams();
  if (params.accountId) query.set("accountId", params.accountId);
  if (params.dateFrom) query.set("dateFrom", params.dateFrom);
  if (params.dateTo) query.set("dateTo", params.dateTo);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  if (params.page != null) query.set("page", String(params.page));
  if (params.pageSize != null) query.set("pageSize", String(params.pageSize));

  const qs = query.toString();
  return apiFetch<PaginatedTransactions>(
    `/api/transactions${qs ? `?${qs}` : ""}`,
  );
}

export function getTransaction(id: string) {
  return apiFetch<{ transaction: Transaction }>(`/api/transactions/${id}`);
}
