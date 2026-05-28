import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/features/auth/server/get-session-user";
import {
  findUserByEmail,
  updateUser,
  toPublicUser,
} from "@/features/auth/server/user-store";
import { updateProfileSchema } from "@/features/auth/schemas";

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = updateProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { fullName, email, phone, avatarUrl } = parsed.data;

  // Prevent email collision with another account.
  if (email !== user.email) {
    const existing = findUserByEmail(email);
    if (existing && existing.id !== user.id) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 409 },
      );
    }
  }

  const updated = updateUser(user.id, { fullName, email, phone, avatarUrl });

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(updated) });
}
