"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/features/profile/components/avatar";
import { useAuth } from "@/features/auth/auth-context";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/accounts", label: "Accounts" },
  { href: "/transactions", label: "Transactions" },
  { href: "/profile", label: "Profile" },
];

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo href="/dashboard" />
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted ${
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/profile"
              className="hidden items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:flex"
              aria-label="Your profile"
            >
              <Avatar fullName={user.fullName} avatarUrl={user.avatarUrl} size="sm" />
            </Link>
          ) : null}
          <Button
            variant="outline"
            size="lg"
            onClick={handleSignOut}
            className="px-3"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
