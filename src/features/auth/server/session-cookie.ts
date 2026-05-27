// Cookie configuration kept free of node:crypto so it can be imported from
// the Edge proxy as well as from Node route handlers.

export const SESSION_COOKIE = "eb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Cookie options for the session cookie. httpOnly to mitigate XSS theft. */
export function sessionCookieOptions(maxAge: number = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
