import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AccountsView } from "@/features/accounts/components/accounts-view";
import * as accountsApi from "@/features/accounts/api";
import type { Account } from "@/features/accounts/types";

vi.mock("@/features/accounts/api");
const mockedApi = vi.mocked(accountsApi);

const accounts: Account[] = [
  {
    id: "acc_current_001",
    userId: "u1",
    type: "current",
    name: "Everyday Current Account",
    accountNumber: "31926048",
    sortCode: "04-00-72",
    balance: 4820.55,
    availableBalance: 4820.55,
    currency: "GBP",
    status: "active",
  },
];

afterEach(() => {
  vi.resetAllMocks();
});

describe("AccountsView", () => {
  it("renders accounts as links to their detail page", async () => {
    mockedApi.getAccounts.mockResolvedValue({ accounts });
    render(<AccountsView />);

    const link = await screen.findByRole("link", {
      name: /view everyday current account/i,
    });
    expect(link).toHaveAttribute("href", "/accounts/acc_current_001");
  });

  it("shows an empty state when there are no accounts", async () => {
    mockedApi.getAccounts.mockResolvedValue({ accounts: [] });
    render(<AccountsView />);
    expect(
      await screen.findByText(/don't have any accounts yet/i),
    ).toBeInTheDocument();
  });

  it("shows an error with a working retry", async () => {
    mockedApi.getAccounts
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({ accounts });

    render(<AccountsView />);
    expect(await screen.findByText("offline")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(
      await screen.findByRole("link", { name: /view everyday current account/i }),
    ).toBeInTheDocument();
  });
});
