import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { findUserById, toPublicUser } from "@/features/auth/server/user-store";
import {
  SESSION_COOKIE,
  verifySessionToken,
} from "@/features/auth/server/session";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = verifySessionToken(token);

  if (!payload) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const user = findUserById(payload.sub);
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({ user: toPublicUser(user) });
}
