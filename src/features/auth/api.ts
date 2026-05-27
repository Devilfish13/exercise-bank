import { apiFetch } from "@/lib/api/client";
import type { AuthResponse } from "@/features/auth/types";
import type { LoginInput, RegisterInput } from "@/features/auth/schemas";

export function login(input: LoginInput) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function register(input: RegisterInput) {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout() {
  return apiFetch<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export function getCurrentUser() {
  return apiFetch<AuthResponse>("/api/auth/me");
}
