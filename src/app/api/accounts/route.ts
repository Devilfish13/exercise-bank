import { NextResponse } from "next/server";

import { getSessionUser } from "@/features/auth/server/get-session-user";
import { findAccountsByUserId } from "@/features/accounts/server/account-store";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ accounts: findAccountsByUserId(user.id) });
}
