import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RegisterForm } from "@/features/auth/components/register-form";

const { push, signUp } = vi.hoisted(() => ({
  push: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/features/auth/auth-context", () => ({
  useAuth: () => ({ signUp }),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("RegisterForm", () => {
  it("flags mismatched passwords and does not submit", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/full name/i), "Alex Morgan");
    await user.type(screen.getByLabelText(/email/i), "alex@eaglebank.com");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "Different123!",
    );
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText(/passwords do not match/i),
    ).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
  });

  it("registers and redirects to the dashboard on success", async () => {
    const user = userEvent.setup();
    signUp.mockResolvedValue({ id: "usr_new" });
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/full name/i), "Jamie Lee");
    await user.type(screen.getByLabelText(/email/i), "jamie@eaglebank.com");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "Password123!",
    );
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(signUp).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/dashboard");
  });
});
