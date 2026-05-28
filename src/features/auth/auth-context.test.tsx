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
  const { status, user, signOut, signUp, refreshUser } = useAuth();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="user">{user?.fullName ?? "none"}</span>
      <button type="button" onClick={() => void signOut()}>
        Sign out
      </button>
      <button
        type="button"
        onClick={() =>
          void signUp({
            fullName: "New User",
            email: "new@eaglebank.com",
            password: "Password123!",
            confirmPassword: "Password123!",
          })
        }
      >
        Sign up
      </button>
      <button type="button" onClick={() => void refreshUser()}>
        Refresh
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

  it("sets the user on sign up", async () => {
    mockedApi.getCurrentUser.mockRejectedValue(new Error("no session"));
    mockedApi.register.mockResolvedValue({ user: demoUser });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("unauthenticated"),
    );

    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("authenticated"),
    );
    expect(screen.getByTestId("user")).toHaveTextContent("Alex Morgan");
    expect(mockedApi.register).toHaveBeenCalledOnce();
  });

  it("updates the user on refreshUser", async () => {
    const updatedUser: User = { ...demoUser, fullName: "Alex Jones" };
    mockedApi.getCurrentUser
      .mockResolvedValueOnce({ user: demoUser })
      .mockResolvedValueOnce({ user: updatedUser });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("Alex Morgan"),
    );

    await userEvent.click(screen.getByRole("button", { name: /refresh/i }));

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("Alex Jones"),
    );
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
