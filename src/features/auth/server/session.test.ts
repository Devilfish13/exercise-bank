import {
  createSessionToken,
  verifySessionToken,
} from "@/features/auth/server/session";

describe("session tokens", () => {
  it("round-trips a user id through sign and verify", () => {
    const token = createSessionToken("usr_123");
    expect(verifySessionToken(token)?.sub).toBe("usr_123");
  });

  it("returns null for an empty or missing token", () => {
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken("")).toBeNull();
  });

  it("returns null for a malformed token", () => {
    expect(verifySessionToken("not-a-token")).toBeNull();
  });

  it("rejects a token with a tampered payload", () => {
    const token = createSessionToken("usr_123");
    const [, signature] = token.split(".");
    const forgedPayload = Buffer.from(
      JSON.stringify({ sub: "usr_attacker", iat: Date.now() }),
    ).toString("base64url");

    expect(verifySessionToken(`${forgedPayload}.${signature}`)).toBeNull();
  });
});
