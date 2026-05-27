import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { loginSchema } from "@/features/auth/schemas";
import { findUserByEmail, toPublicUser } from "@/features/auth/server/user-store";
import { verifyPassword } from "@/features/auth/server/password";
import { createSessionToken } from "@/features/auth/server/session";
import {
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/features/auth/server/session-cookie";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const user = findUserByEmail(parsed.data.email);
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 },
    );
  }

  const token = createSessionToken(user.id);
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions());

  return NextResponse.json({ user: toPublicUser(user) });
}
