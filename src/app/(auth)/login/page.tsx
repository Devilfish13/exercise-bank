import type { Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Log in to your Eagle Bank account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        <p className="rounded-md bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
          Demo login: <strong>demo@eaglebank.com</strong> /{" "}
          <strong>Password123!</strong>
        </p>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <span>
          New to Eagle Bank?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Open an account
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
