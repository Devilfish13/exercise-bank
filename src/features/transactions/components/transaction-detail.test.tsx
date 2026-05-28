import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { TransactionDetail } from "@/features/transactions/components/transaction-detail";
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

const mockGetTransaction = vi.fn();
vi.mock("@/features/transactions/api", () => ({
  getTransaction: (...args: unknown[]) => mockGetTransaction(...args),
}));

const TRANSACTION = {
  id: "txn_0001",
  accountId: "acc_current_001",
  type: "deposit",
  description: "Salary",
  counterparty: "Northwind Ltd",
  amount: 3200,
  currency: "GBP",
  status: "completed",
  date: "2026-05-25T08:02:00.000Z",
};

describe("TransactionDetail", () => {
  it("renders transaction details", async () => {
    mockGetTransaction.mockResolvedValue({ transaction: TRANSACTION });
    render(<TransactionDetail id="txn_0001" />);

    await waitFor(() => {
      expect(screen.getByText("Salary")).toBeInTheDocument();
      expect(screen.getAllByText("Northwind Ltd").length).toBeGreaterThan(0);
      expect(screen.getByText(/£3,200/)).toBeInTheDocument();
      expect(screen.getByText("Completed")).toBeInTheDocument();
    });
  });

  it("shows a back link to /transactions", async () => {
    mockGetTransaction.mockResolvedValue({ transaction: TRANSACTION });
    render(<TransactionDetail id="txn_0001" />);

    await waitFor(() => {
      const link = screen.getByRole("link", { name: /back to transactions/i });
      expect(link).toHaveAttribute("href", "/transactions");
    });
  });

  it("shows a 404 message for unknown transactions", async () => {
    mockGetTransaction.mockRejectedValue(
      new ApiError("Transaction not found", 404),
    );
    render(<TransactionDetail id="txn_bad" />);

    await waitFor(() => {
      expect(screen.getByText(/transaction not found/i)).toBeInTheDocument();
    });
  });

  it("shows retry for non-404 errors", async () => {
    mockGetTransaction
      .mockRejectedValueOnce(new Error("Server error"))
      .mockResolvedValue({ transaction: TRANSACTION });

    const user = userEvent.setup();
    render(<TransactionDetail id="txn_0001" />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByText("Salary")).toBeInTheDocument();
    });
  });
});
