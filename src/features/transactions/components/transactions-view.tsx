"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionList } from "@/features/transactions/components/transaction-list";
import { getTransactions } from "@/features/transactions/api";
import { getAccounts } from "@/features/accounts/api";
import type {
  PaginatedTransactions,
  TransactionSortBy,
  SortOrder,
} from "@/features/transactions/types";

type Filters = {
  accountId: string;
  dateFrom: string;
  dateTo: string;
  sortBy: TransactionSortBy;
  sortOrder: SortOrder;
  page: number;
};

function filtersFromParams(params: URLSearchParams): Filters {
  return {
    accountId: params.get("accountId") ?? "",
    dateFrom: params.get("dateFrom") ?? "",
    dateTo: params.get("dateTo") ?? "",
    sortBy: (params.get("sortBy") as TransactionSortBy) ?? "date",
    sortOrder: (params.get("sortOrder") as SortOrder) ?? "desc",
    page: parseInt(params.get("page") ?? "1", 10),
  };
}

function filtersToParams(filters: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.accountId) p.set("accountId", filters.accountId);
  if (filters.dateFrom) p.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) p.set("dateTo", filters.dateTo);
  p.set("sortBy", filters.sortBy);
  p.set("sortOrder", filters.sortOrder);
  if (filters.page > 1) p.set("page", String(filters.page));
  return p;
}

type AccountOption = { id: string; name: string };

type SortButtonProps = {
  field: TransactionSortBy;
  label: string;
  activeField: TransactionSortBy;
  sortOrder: SortOrder;
  onToggle: (field: TransactionSortBy) => void;
};

function SortButton({
  field,
  label,
  activeField,
  sortOrder,
  onToggle,
}: SortButtonProps) {
  const active = activeField === field;
  return (
    <button
      type="button"
      onClick={() => onToggle(field)}
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors hover:bg-muted ${
        active ? "font-semibold text-foreground" : "text-muted-foreground"
      }`}
      aria-pressed={active}
      aria-label={`Sort by ${label}${active ? `, ${sortOrder === "asc" ? "ascending" : "descending"}` : ""}`}
    >
      {label}
      <ArrowUpDown
        className={`size-3.5 ${active ? "opacity-100" : "opacity-40"}`}
        aria-hidden="true"
      />
      {active ? (
        <span className="sr-only">
          {sortOrder === "asc" ? "ascending" : "descending"}
        </span>
      ) : null}
    </button>
  );
}

export function TransactionsView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [filters, setFilters] = useState<Filters>(() =>
    filtersFromParams(searchParams),
  );
  const [result, setResult] = useState<PaginatedTransactions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    void getAccounts().then((d) => setAccounts(d.accounts));
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const data = await getTransactions({
          accountId: filters.accountId || undefined,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          page: filters.page,
        });
        if (!cancelled) {
          setResult(data);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("Failed to load transactions"),
          );
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filters, retryKey]);

  function updateFilters(next: Partial<Filters>) {
    const updated = { ...filters, ...next, page: next.page ?? 1 };
    setFilters(updated);
    setIsLoading(true);
    setError(null);
    const params = filtersToParams(updated);
    router.replace(`/transactions?${params.toString()}`, { scroll: false });
  }

  function toggleSort(field: TransactionSortBy) {
    if (filters.sortBy === field) {
      updateFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      updateFilters({ sortBy: field, sortOrder: "desc" });
    }
  }

  if (error) {
    return (
      <ErrorState
        title="We couldn't load your transactions"
        message={error.message}
        onRetry={() => {
          setIsLoading(true);
          setError(null);
          setRetryKey((k) => k + 1);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <fieldset>
            <legend className="mb-3 text-sm font-medium">Filter &amp; sort</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <Label htmlFor="filter-account">Account</Label>
                <select
                  id="filter-account"
                  value={filters.accountId}
                  onChange={(e) => updateFilters({ accountId: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <option value="">All accounts</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="filter-date-from">From</Label>
                <Input
                  id="filter-date-from"
                  type="date"
                  value={filters.dateFrom}
                  max={filters.dateTo || undefined}
                  onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="filter-date-to">To</Label>
                <Input
                  id="filter-date-to"
                  type="date"
                  value={filters.dateTo}
                  min={filters.dateFrom || undefined}
                  onChange={(e) => updateFilters({ dateTo: e.target.value })}
                />
              </div>

              <div className="flex flex-col justify-end gap-1.5">
                <span className="text-sm font-medium">Sort by</span>
                <div className="flex items-center gap-1">
                  <SortButton
                    field="date"
                    label="Date"
                    activeField={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onToggle={toggleSort}
                  />
                  <SortButton
                    field="amount"
                    label="Amount"
                    activeField={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onToggle={toggleSort}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent className="pt-4">
          {isLoading ? (
            <TransactionsSkeleton />
          ) : result && result.transactions.length > 0 ? (
            <>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {result.total} transaction{result.total !== 1 ? "s" : ""}
                </p>
              </div>
              <TransactionList
                transactions={result.transactions}
                getHref={(txn) => `/transactions/${txn.id}`}
              />
              {result.totalPages > 1 && (
                <Pagination
                  page={result.page}
                  totalPages={result.totalPages}
                  onPageChange={(p) => updateFilters({ page: p })}
                />
              )}
            </>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No transactions match your filters.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav
      className="mt-4 flex items-center justify-between border-t border-border pt-4"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Previous
      </Button>

      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}

function TransactionsSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-1">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
