import { cookies } from "next/headers";

import { verifySessionToken } from "@/features/auth/server/session";
import { SESSION_COOKIE } from "@/features/auth/server/session-cookie";
import {
  findUserById,
  type StoredUser,
} from "@/features/auth/server/user-store";

/** Read and verify the session cookie, returning the user or null. */
export async function getSessionUser(): Promise<StoredUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  return findUserById(payload.sub) ?? null;
}
