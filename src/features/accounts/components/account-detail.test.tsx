import { render, screen } from "@testing-library/react";

import { AccountDetail } from "@/features/accounts/components/account-detail";
import * as accountsApi from "@/features/accounts/api";
import { ApiError } from "@/lib/api/client";
import type { AccountDetail as AccountDetailData } from "@/features/accounts/types";

vi.mock("@/features/accounts/api");
const mockedApi = vi.mocked(accountsApi);

const detail: AccountDetailData = {
  account: {
    id: "acc_isa_001",
    userId: "u1",
    type: "isa",
    name: "Tax-Free ISA",
    accountNumber: "77410523",
    sortCode: "04-00-72",
    balance: 15250,
    availableBalance: 15250,
    currency: "GBP",
    status: "active",
  },
  transactions: [
    {
      id: "t1",
      accountId: "acc_isa_001",
      type: "deposit",
      description: "Monthly saving",
      amount: 250,
      currency: "GBP",
      status: "completed",
      date: "2026-05-05T07:00:00.000Z",
    },
  ],
};

afterEach(() => {
  vi.resetAllMocks();
});

describe("AccountDetail", () => {
  it("renders the account and its transactions", async () => {
    mockedApi.getAccount.mockResolvedValue(detail);
    render(<AccountDetail accountId="acc_isa_001" />);

    expect(await screen.findByText("Tax-Free ISA")).toBeInTheDocument();
    expect(screen.getByText("Monthly saving")).toBeInTheDocument();
  });

  it("shows a not-found state on a 404", async () => {
    mockedApi.getAccount.mockRejectedValue(
      new ApiError("Account not found", 404),
    );
    render(<AccountDetail accountId="missing" />);

    expect(await screen.findByText("Account not found")).toBeInTheDocument();
    // 404 is terminal — no retry button
    expect(
      screen.queryByRole("button", { name: /try again/i }),
    ).not.toBeInTheDocument();
  });
});
