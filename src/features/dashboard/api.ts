import { apiFetch } from "@/lib/api/client";
import type { DashboardData } from "@/features/dashboard/types";

export function getDashboard() {
  return apiFetch<DashboardData>("/api/dashboard");
}
