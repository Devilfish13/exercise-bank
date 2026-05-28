import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/features/auth/server/get-session-user";
import { findAccountsByUserId } from "@/features/accounts/server/account-store";
import { queryTransactions } from "@/features/transactions/server/transaction-store";
import type { TransactionSortBy, SortOrder } from "@/features/transactions/types";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userAccountIds = findAccountsByUserId(user.id).map((a) => a.id);
  const { searchParams } = request.nextUrl;

  const accountId = searchParams.get("accountId") ?? undefined;
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;
  const sortBy = (searchParams.get("sortBy") ?? "date") as TransactionSortBy;
  const sortOrder = (searchParams.get("sortOrder") ?? "desc") as SortOrder;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);

  const result = queryTransactions({
    accountIds: userAccountIds,
    accountId,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page,
    pageSize,
  });

  return NextResponse.json(result);
}
