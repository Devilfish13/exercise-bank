import { afterEach, beforeEach, vi } from "vitest";
import { apiFetch, ApiError } from "@/lib/api/client";

const mockFetch = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function makeResponse(
  body: unknown,
  options: { status?: number; contentType?: string } = {},
) {
  const { status = 200, contentType = "application/json" } = options;
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: {
      get: (key: string) => (key === "content-type" ? contentType : null),
    },
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

describe("apiFetch", () => {
  it("returns parsed JSON on a successful response", async () => {
    mockFetch.mockResolvedValue(
      makeResponse({ accounts: [] }),
    );

    const result = await apiFetch<{ accounts: unknown[] }>("/api/accounts");

    expect(result).toEqual({ accounts: [] });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/accounts",
      expect.objectContaining({
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      }),
    );
  });

  it("throws ApiError with the response body message on failure", async () => {
    mockFetch.mockResolvedValue(
      makeResponse({ message: "Not authenticated" }, { status: 401 }),
    );

    await expect(apiFetch("/api/accounts")).rejects.toMatchObject({
      name: "ApiError",
      message: "Not authenticated",
      status: 401,
    });
  });

  it("falls back to statusText when no JSON message is present", async () => {
    mockFetch.mockResolvedValue(
      makeResponse(null, { status: 500, contentType: "text/plain" }),
    );

    await expect(apiFetch("/api/accounts")).rejects.toMatchObject({
      status: 500,
      message: "Error",
    });
  });

  it("falls back to generic message when body has no message field", async () => {
    mockFetch.mockResolvedValue(
      makeResponse({}, { status: 400 }),
    );

    const error = await apiFetch("/api/test").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).message).toBeTruthy();
  });

  it("merges caller-provided headers with the default Content-Type", async () => {
    mockFetch.mockResolvedValue(makeResponse({}));

    await apiFetch("/api/test", { headers: { Authorization: "Bearer tok" } });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer tok",
        }),
      }),
    );
  });
});
