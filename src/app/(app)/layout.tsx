"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { useAuth } from "@/features/auth/auth-context";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div
        className="flex min-h-dvh items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2
          className="size-6 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
        <span className="sr-only">Loading your account…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
