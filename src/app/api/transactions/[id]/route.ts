import { NextResponse } from "next/server";

import { getSessionUser } from "@/features/auth/server/get-session-user";
import { findAccountsByUserId } from "@/features/accounts/server/account-store";
import { findTransactionById } from "@/features/transactions/server/transaction-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const txn = findTransactionById(id);

  // 404 (not 403) to avoid leaking whether an id exists at all.
  if (!txn) {
    return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
  }

  const userAccountIds = new Set(
    findAccountsByUserId(user.id).map((a) => a.id),
  );

  if (!userAccountIds.has(txn.accountId)) {
    return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
  }

  return NextResponse.json({ transaction: txn });
}
