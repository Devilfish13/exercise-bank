import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "px-4",
            )}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "px-4",
            )}
          >
            Open an account
          </Link>
        </nav>
      </div>
    </header>
  );
}
