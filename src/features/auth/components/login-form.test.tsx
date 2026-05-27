import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LoginForm } from "@/features/auth/components/login-form";
import { ApiError } from "@/lib/api/client";

const { push, signIn } = vi.hoisted(() => ({
  push: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/features/auth/auth-context", () => ({
  useAuth: () => ({ signIn }),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("LoginForm", () => {
  it("shows validation errors and does not submit when fields are empty", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(signIn).not.toHaveBeenCalled();
  });

  it("signs in and redirects to the dashboard on success", async () => {
    const user = userEvent.setup();
    signIn.mockResolvedValue({ id: "usr_demo_0001" });
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "demo@eaglebank.com");
    await user.type(screen.getByLabelText(/password/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(signIn).toHaveBeenCalledWith({
      email: "demo@eaglebank.com",
      password: "Password123!",
    });
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("shows the API error message when credentials are rejected", async () => {
    const user = userEvent.setup();
    signIn.mockRejectedValue(new ApiError("Invalid email or password", 401));
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "demo@eaglebank.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/invalid email or password/i),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
