import { NextRequest } from "next/server";

import { proxy } from "@/proxy";
import { SESSION_COOKIE } from "@/features/auth/server/session-cookie";

function makeRequest(path: string, { authed = false } = {}) {
  const request = new NextRequest(new URL(`http://localhost${path}`));
  if (authed) {
    request.cookies.set(SESSION_COOKIE, "some-token");
  }
  return request;
}

describe("proxy auth gate", () => {
  it("redirects unauthenticated users away from protected routes", () => {
    const response = proxy(makeRequest("/dashboard"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });

  it("preserves the intended path as a next param", () => {
    const response = proxy(makeRequest("/accounts/123"));
    const location = response.headers.get("location") ?? "";
    expect(location).toContain("next=%2Faccounts%2F123");
  });

  it("allows authenticated users to reach protected routes", () => {
    const response = proxy(makeRequest("/dashboard", { authed: true }));
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects authenticated users away from auth pages", () => {
    const response = proxy(makeRequest("/login", { authed: true }));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/dashboard");
  });

  it("allows unauthenticated users to view auth pages", () => {
    const response = proxy(makeRequest("/register"));
    expect(response.headers.get("location")).toBeNull();
  });
});
