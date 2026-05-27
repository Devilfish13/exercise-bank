import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import * as dashboardApi from "@/features/dashboard/api";
import type { DashboardData } from "@/features/dashboard/types";

vi.mock("@/features/dashboard/api");
const mockedApi = vi.mocked(dashboardApi);

const data: DashboardData = {
  summary: {
    totalBalance: 18830.25,
    monthlyDeposits: 3999.99,
    monthlyWithdrawals: 2527.01,
    currency: "GBP",
  },
  accounts: [
    {
      id: "acc_isa",
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
  ],
  recentTransactions: [
    {
      id: "t1",
      accountId: "acc_isa",
      type: "deposit",
      description: "Salary",
      counterparty: "Northwind Ltd",
      amount: 3200,
      currency: "GBP",
      status: "completed",
      date: "2026-05-25T08:00:00.000Z",
    },
  ],
};

afterEach(() => {
  vi.resetAllMocks();
});

describe("DashboardView", () => {
  it("renders summary, accounts, and transactions once loaded", async () => {
    mockedApi.getDashboard.mockResolvedValue(data);
    render(<DashboardView />);

    expect(await screen.findByText("Total balance")).toBeInTheDocument();
    expect(screen.getByText(/£18,830\.25/)).toBeInTheDocument();
    expect(screen.getByText("Tax-Free ISA")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
  });

  it("shows an error with a working retry", async () => {
    mockedApi.getDashboard
      .mockRejectedValueOnce(new Error("Network down"))
      .mockResolvedValueOnce(data);

    render(<DashboardView />);

    expect(await screen.findByText("Network down")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(await screen.findByText("Total balance")).toBeInTheDocument();
    expect(mockedApi.getDashboard).toHaveBeenCalledTimes(2);
  });
});
