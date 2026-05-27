import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent"
        />
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <span className="inline-flex animate-in fade-in slide-in-from-bottom-2 items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-muted-foreground duration-500">
            <span
              className="size-2 rounded-full bg-primary"
              aria-hidden="true"
            />
            Modern banking, reimagined
          </span>
          <h1 className="mt-6 max-w-3xl animate-in fade-in slide-in-from-bottom-3 text-balance text-4xl font-semibold tracking-tight text-foreground duration-700 sm:text-5xl md:text-6xl">
            Banking that keeps up with your life
          </h1>
          <p className="mt-6 max-w-2xl animate-in fade-in slide-in-from-bottom-3 text-pretty text-lg text-muted-foreground duration-700 sm:text-xl">
            {siteConfig.name} brings your accounts, transactions, and insights
            into one secure, fast, and beautifully simple dashboard.
          </p>
          <div className="mt-10 flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-3 duration-700 sm:flex-row">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-12 px-6 text-base"
              )}
            >
              Open an account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 px-6 text-base"
              )}
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-primary px-6 py-12 text-center text-primary-foreground sm:py-16">
          <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to take control of your money?
          </h2>
          <p className="max-w-xl text-pretty text-primary-foreground/80">
            Create your {siteConfig.name} account in minutes. No paperwork, no
            waiting.
          </p>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "h-12 px-6 text-base"
            )}
          >
            Get started
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
