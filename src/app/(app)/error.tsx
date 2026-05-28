"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <AlertCircle className="mb-4 size-10 text-destructive" aria-hidden="true" />
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. You can try again or come back later.
      </p>
      {error.digest ? (
        <p className="mt-1 font-mono text-xs text-muted-foreground/60">
          {error.digest}
        </p>
      ) : null}
      <Button className="mt-6" onClick={unstable_retry}>
        Try again
      </Button>
    </div>
  );
}
