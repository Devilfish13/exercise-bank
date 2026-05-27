import { NextResponse } from "next/server";

import { getSessionUser } from "@/features/auth/server/get-session-user";
import { getDashboardForUser } from "@/features/dashboard/server/get-dashboard";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json(getDashboardForUser(user.id));
}
