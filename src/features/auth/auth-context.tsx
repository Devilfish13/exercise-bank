"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { User } from "@/features/auth/types";
import type { LoginInput, RegisterInput } from "@/features/auth/schemas";
import * as authApi from "@/features/auth/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  signIn: (input: LoginInput) => Promise<User>;
  signUp: (input: RegisterInput) => Promise<User>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const { user } = await authApi.getCurrentUser();
        if (!cancelled) {
          setUser(user);
          setStatus("authenticated");
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (input: LoginInput) => {
    const { user } = await authApi.login(input);
    setUser(user);
    setStatus("authenticated");
    return user;
  }, []);

  const signUp = useCallback(async (input: RegisterInput) => {
    const { user } = await authApi.register(input);
    setUser(user);
    setStatus("authenticated");
    return user;
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const refreshUser = useCallback(async () => {
    const { user: freshUser } = await authApi.getCurrentUser();
    setUser(freshUser);
    return freshUser;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, signIn, signUp, signOut, refreshUser }),
    [user, status, signIn, signUp, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
