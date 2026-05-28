import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach } from "vitest";

import { ProfileForm } from "@/features/profile/components/profile-form";
import { ApiError } from "@/lib/api/client";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockUpdateProfile = vi.fn();
const mockRefreshUser = vi.fn();

vi.mock("@/features/auth/api", () => ({
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}));

vi.mock("@/features/auth/auth-context", () => ({
  useAuth: () => ({ refreshUser: mockRefreshUser }),
}));

const USER = {
  id: "usr_demo_0001",
  fullName: "Alex Morgan",
  email: "demo@eaglebank.com",
  phone: "+44 777 6688 4444",
  createdAt: "2025-01-15T09:30:00.000Z",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockUpdateProfile.mockResolvedValue({ user: USER });
  mockRefreshUser.mockResolvedValue(USER);
});

function setup() {
  const user = userEvent.setup();
  render(<ProfileForm user={USER} />);
  return { user };
}

describe("ProfileForm", () => {
  it("pre-fills fields with current user data", () => {
    setup();
    expect(screen.getByDisplayValue("Alex Morgan")).toBeInTheDocument();
    expect(screen.getByDisplayValue("demo@eaglebank.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+44 777 6688 4444")).toBeInTheDocument();
  });

  it("shows success message after saving", async () => {
    const { user } = setup();
    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Alex Jones");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/profile updated successfully/i),
      ).toBeInTheDocument();
    });
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: "Alex Jones" }),
    );
  });

  it("shows a server error when the request fails", async () => {
    mockUpdateProfile.mockRejectedValueOnce(
      new ApiError("Email is already in use", 409),
    );
    const { user } = setup();
    await user.clear(screen.getByLabelText(/full name/i));
    await user.type(screen.getByLabelText(/full name/i), "Alex Jones");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Email is already in use"),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for empty name", async () => {
    const { user } = setup();
    await user.clear(screen.getByLabelText(/full name/i));

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/enter your full name/i),
      ).toBeInTheDocument();
    });
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });

  it("shows avatar initials when no avatarUrl", () => {
    render(<ProfileForm user={{ ...USER, avatarUrl: undefined }} />);
    expect(screen.getByLabelText(/alex morgan avatar/i)).toBeInTheDocument();
  });

  it("renders photo upload button", () => {
    setup();
    expect(
      screen.getByRole("button", { name: /change photo/i }),
    ).toBeInTheDocument();
  });
});
