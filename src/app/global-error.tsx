"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-16 text-center font-sans text-foreground antialiased">
        <p className="text-5xl font-bold text-destructive/20 select-none">!</p>
        <h1 className="mt-4 text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Eagle Bank encountered an unexpected error. Please try again.
        </p>
        {error.digest ? (
          <p className="mt-1 font-mono text-xs text-muted-foreground/60">
            {error.digest}
          </p>
        ) : null}
        <button
          onClick={unstable_retry}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
