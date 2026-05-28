import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach } from "vitest";

import { TransactionsView } from "@/features/transactions/components/transactions-view";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(),
}));

const mockGetTransactions = vi.fn();
const mockGetAccounts = vi.fn();
vi.mock("@/features/transactions/api", () => ({
  getTransactions: (...args: unknown[]) => mockGetTransactions(...args),
}));
vi.mock("@/features/accounts/api", () => ({
  getAccounts: (...args: unknown[]) => mockGetAccounts(...args),
}));

const ACCOUNTS = [
  { id: "acc_current_001", name: "Everyday Current Account" },
  { id: "acc_isa_001", name: "Cash ISA" },
];

const TRANSACTIONS = [
  {
    id: "txn_0001",
    accountId: "acc_current_001",
    type: "deposit",
    description: "Salary",
    counterparty: "Northwind Ltd",
    amount: 3200,
    currency: "GBP",
    status: "completed",
    date: "2026-05-25T08:02:00.000Z",
  },
  {
    id: "txn_0002",
    accountId: "acc_current_001",
    type: "withdrawal",
    description: "Groceries",
    counterparty: "Tesco",
    amount: -84.27,
    currency: "GBP",
    status: "completed",
    date: "2026-05-24T18:41:00.000Z",
  },
];

function makePageResult(
  transactions = TRANSACTIONS,
  page = 1,
  totalPages = 1,
) {
  return {
    transactions,
    total: transactions.length,
    page,
    pageSize: 10,
    totalPages,
  };
}

beforeEach(() => {
  mockGetAccounts.mockResolvedValue({ accounts: ACCOUNTS });
  mockGetTransactions.mockResolvedValue(makePageResult());
});

function setup() {
  const user = userEvent.setup();
  render(<TransactionsView />);
  return { user };
}

describe("TransactionsView", () => {
  it("shows transactions after loading", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getByText("Salary")).toBeInTheDocument();
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });
  });

  it("shows empty state when no transactions match", async () => {
    mockGetTransactions.mockResolvedValue(makePageResult([]));
    setup();
    await waitFor(() => {
      expect(
        screen.getByText(/No transactions match/i),
      ).toBeInTheDocument();
    });
  });

  it("shows error state and allows retry", async () => {
    mockGetTransactions.mockRejectedValueOnce(new Error("Network error"));
    const { user } = setup();

    await waitFor(() => {
      expect(
        screen.getByText(/couldn't load your transactions/i),
      ).toBeInTheDocument();
    });

    mockGetTransactions.mockResolvedValue(makePageResult());
    await user.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByText("Salary")).toBeInTheDocument();
    });
  });

  it("renders account options in the filter dropdown", async () => {
    setup();
    await waitFor(() => {
      const select = screen.getByRole("combobox", { name: /account/i });
      expect(within(select).getByText("All accounts")).toBeInTheDocument();
      expect(
        within(select).getByText("Everyday Current Account"),
      ).toBeInTheDocument();
    });
  });

  it("shows pagination controls when multiple pages", async () => {
    mockGetTransactions.mockResolvedValue(makePageResult(TRANSACTIONS, 1, 3));
    setup();
    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: /pagination/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next page/i })).toBeEnabled();
      expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();
    });
  });

  it("each transaction row links to the detail page", async () => {
    setup();
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /salary/i });
      expect(link).toHaveAttribute("href", "/transactions/txn_0001");
    });
  });

  it("calls getTransactions with sortBy=amount when Amount sort button is clicked", async () => {
    const { user } = setup();

    await waitFor(() => screen.getByText("Salary"));

    mockGetTransactions.mockResolvedValue(makePageResult());
    await user.click(screen.getByRole("button", { name: /sort by amount/i }));

    await waitFor(() => {
      expect(mockGetTransactions).toHaveBeenLastCalledWith(
        expect.objectContaining({ sortBy: "amount" }),
      );
    });
  });

  it("toggles sort direction when the active sort field is clicked again", async () => {
    const { user } = setup();

    await waitFor(() => screen.getByText("Salary"));

    mockGetTransactions.mockResolvedValue(makePageResult());
    // Click Date (already active, sortOrder is "desc") → should flip to "asc"
    await user.click(screen.getByRole("button", { name: /sort by date/i }));

    await waitFor(() => {
      expect(mockGetTransactions).toHaveBeenLastCalledWith(
        expect.objectContaining({ sortBy: "date", sortOrder: "asc" }),
      );
    });
  });
});
