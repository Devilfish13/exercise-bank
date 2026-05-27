"use client";

import { AccountsView } from "@/features/accounts/components/accounts-view";

export default function AccountsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Accounts
        </h1>
        <p className="mt-1 text-muted-foreground">
          View and manage your accounts.
        </p>
      </header>
      <AccountsView />
    </div>
  );
}
