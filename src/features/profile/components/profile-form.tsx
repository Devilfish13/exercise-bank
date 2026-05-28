"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Camera, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TextField } from "@/features/auth/components/text-field";
import { Avatar } from "@/features/profile/components/avatar";
import { updateProfileSchema, type UpdateProfileInput } from "@/features/auth/schemas";
import { useAuth } from "@/features/auth/auth-context";
import * as authApi from "@/features/auth/api";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/features/auth/types";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB

type ProfileFormProps = {
  user: User;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const { refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatarUrl ?? null,
  );
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone ?? "",
      avatarUrl: user.avatarUrl ?? "",
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("Image must be under 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSaved(false);

    try {
      await authApi.updateProfile({
        ...values,
        avatarUrl: avatarPreview ?? undefined,
      });
      const freshUser = await refreshUser();
      reset({
        fullName: freshUser.fullName,
        email: freshUser.email,
        phone: freshUser.phone ?? "",
        avatarUrl: freshUser.avatarUrl ?? "",
      });
      setSaved(true);
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  });

  const avatarForDisplay = avatarPreview;

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Profile photo</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5">
            <Avatar
              fullName={user.fullName}
              avatarUrl={avatarForDisplay}
              size="lg"
            />
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Camera className="size-4" aria-hidden="true" />
                Change photo
              </Button>
              {avatarError ? (
                <p className="text-sm text-destructive" role="alert">
                  {avatarError}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF · max 2 MB
                </p>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Upload profile photo"
            onChange={handleFileChange}
          />
        </CardContent>
      </Card>

      {/* Profile fields */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Personal details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            {formError ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {formError}
              </div>
            ) : null}

            {saved ? (
              <div
                role="status"
                className="flex items-center gap-2 rounded-md border border-emerald-600/30 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
              >
                <CheckCircle className="size-4 shrink-0" aria-hidden="true" />
                Profile updated successfully.
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                id="fullName"
                label="Full name"
                autoComplete="name"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
              <TextField
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <TextField
                id="phone"
                label="Phone number"
                type="tel"
                autoComplete="tel"
                placeholder="+44 7700 900000"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || (!isDirty && avatarPreview === (user.avatarUrl ?? null))}
                className="min-w-28"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
