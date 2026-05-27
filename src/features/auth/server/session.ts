import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.AUTH_SECRET ?? "dev-insecure-eagle-bank-secret";

export type SessionPayload = {
  sub: string;
  iat: number;
};

function sign(encoded: string): string {
  return createHmac("sha256", SECRET).update(encoded).digest("base64url");
}

/** Create a signed, tamper-evident session token for a user id. */
export function createSessionToken(userId: string): string {
  const payload: SessionPayload = { sub: userId, iat: Date.now() };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

/** Verify a session token's signature and return its payload, or null. */
export function verifySessionToken(
  token: string | undefined | null,
): SessionPayload | null {
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(signatureBuf, expectedBuf)) return null;

  try {
    return JSON.parse(
      Buffer.from(encoded, "base64url").toString(),
    ) as SessionPayload;
  } catch {
    return null;
  }
}
