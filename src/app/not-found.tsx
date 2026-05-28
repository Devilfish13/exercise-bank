import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

import { Logo } from "@/components/layout/logo";

export const metadata = {
  title: "Page not found – Eagle Bank",
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-10">
        <Logo href="/" />
      </div>

      <p className="text-8xl font-bold tabular-nums text-primary/20 select-none">
        404
      </p>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
        have been moved or the address was mistyped.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Home className="size-4" aria-hidden="true" />
          Go to dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
