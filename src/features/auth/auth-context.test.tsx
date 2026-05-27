import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthProvider, useAuth } from "@/features/auth/auth-context";
import * as authApi from "@/features/auth/api";
import type { User } from "@/features/auth/types";

vi.mock("@/features/auth/api");
const mockedApi = vi.mocked(authApi);

const demoUser: User = {
  id: "usr_demo_0001",
  fullName: "Alex Morgan",
  email: "demo@eaglebank.com",
  createdAt: "2025-01-15T09:30:00.000Z",
};

function Consumer() {
  const { status, user, signOut } = useAuth();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="user">{user?.fullName ?? "none"}</span>
      <button type="button" onClick={() => void signOut()}>
        Sign out
      </button>
    </div>
  );
}

afterEach(() => {
  vi.resetAllMocks();
});

describe("AuthProvider", () => {
  it("hydrates to authenticated when the session is valid", async () => {
    mockedApi.getCurrentUser.mockResolvedValue({ user: demoUser });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("authenticated"),
    );
    expect(screen.getByTestId("user")).toHaveTextContent("Alex Morgan");
  });

  it("falls back to unauthenticated when there is no session", async () => {
    mockedApi.getCurrentUser.mockRejectedValue(new Error("Not authenticated"));

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("unauthenticated"),
    );
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });

  it("clears the user on sign out", async () => {
    mockedApi.getCurrentUser.mockResolvedValue({ user: demoUser });
    mockedApi.logout.mockResolvedValue({ ok: true });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("authenticated"),
    );

    await userEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("unauthenticated"),
    );
    expect(mockedApi.logout).toHaveBeenCalledOnce();
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });
});
