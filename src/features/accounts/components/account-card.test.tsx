import { render, screen } from "@testing-library/react";

import { AccountCard } from "@/features/accounts/components/account-card";
import type { Account } from "@/features/accounts/types";

const base: Account = {
  id: "acc",
  userId: "u1",
  type: "current",
  name: "Everyday Current Account",
  accountNumber: "31926048",
  sortCode: "04-00-72",
  balance: 4820.55,
  availableBalance: 4820.55,
  currency: "GBP",
  status: "active",
};

describe("AccountCard", () => {
  it("shows a deposit account's available balance and masked number", () => {
    render(<AccountCard account={base} />);
    expect(screen.getByText("Current account")).toBeInTheDocument();
    expect(screen.getByText("Available balance")).toBeInTheDocument();
    expect(screen.getByText(/£4,820\.55/)).toBeInTheDocument();
    expect(screen.getByText(/•••• 6048/)).toBeInTheDocument();
  });

  it("renders a credit card as balance owed with available credit", () => {
    render(
      <AccountCard
        account={{
          ...base,
          type: "credit",
          name: "Eagle Rewards Credit Card",
          sortCode: undefined,
          balance: 1240.3,
          availableBalance: 3759.7,
          creditLimit: 5000,
        }}
      />,
    );
    expect(screen.getByText("Credit card")).toBeInTheDocument();
    expect(screen.getByText("Balance owed")).toBeInTheDocument();
    expect(
      screen.getByText(/£3,759\.70 available of £5,000\.00/),
    ).toBeInTheDocument();
  });
});
