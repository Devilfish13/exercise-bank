import { AccountCard } from "@/features/accounts/components/account-card";
import type { Account } from "@/features/accounts/types";

export function AccountsOverview({ accounts }: { accounts: Account[] }) {
  return (
    <section aria-labelledby="accounts-heading">
      <h2 id="accounts-heading" className="mb-4 text-lg font-semibold">
        Your accounts
      </h2>
      {accounts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
          You don&apos;t have any accounts yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <li key={account.id}>
              <AccountCard account={account} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
