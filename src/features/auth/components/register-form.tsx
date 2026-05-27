"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TextField } from "@/features/auth/components/text-field";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import { useAuth } from "@/features/auth/auth-context";
import { ApiError } from "@/lib/api/client";

export function RegisterForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await signUp(values);
      router.push("/dashboard");
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {formError}
        </div>
      ) : null}

      <TextField
        id="fullName"
        label="Full name"
        autoComplete="name"
        placeholder="Alex Morgan"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        id="phone"
        label="Phone number (optional)"
        type="tel"
        autoComplete="tel"
        placeholder="+44 7700 900000"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <TextField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
