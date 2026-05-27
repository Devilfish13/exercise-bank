import { NextResponse } from "next/server";

import { getSessionUser } from "@/features/auth/server/get-session-user";
import { findAccountById } from "@/features/accounts/server/account-store";
import { findTransactionsByAccountIds } from "@/features/transactions/server/transaction-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const account = findAccountById(id);

  // Return 404 (not 403) when the account isn't the user's, so we don't leak
  // whether an account id exists.
  if (!account || account.userId !== user.id) {
    return NextResponse.json({ message: "Account not found" }, { status: 404 });
  }

  return NextResponse.json({
    account,
    transactions: findTransactionsByAccountIds([account.id]),
  });
}
