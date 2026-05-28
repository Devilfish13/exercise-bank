"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/features/profile/components/avatar";
import { useAuth } from "@/features/auth/auth-context";

export function AppHeader() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo href="/dashboard" />

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
