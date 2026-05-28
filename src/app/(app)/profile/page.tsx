"use client";

import { ProfileForm } from "@/features/profile/components/profile-form";
import { useAuth } from "@/features/auth/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Profile
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your personal details and photo.
        </p>
      </header>
      {user ? <ProfileForm user={user} /> : null}
    </div>
  );
}
