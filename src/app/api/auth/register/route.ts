import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { registerSchema } from "@/features/auth/schemas";
import {
  createUser,
  findUserByEmail,
  toPublicUser,
} from "@/features/auth/server/user-store";
import { hashPassword } from "@/features/auth/server/password";
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

  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { fullName, email, phone, password } = parsed.data;

  if (findUserByEmail(email)) {
    return NextResponse.json(
      { message: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const user = createUser({
    fullName,
    email,
    phone: phone || undefined,
    passwordHash: hashPassword(password),
  });

  const token = createSessionToken(user.id);
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions());

  return NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
}
