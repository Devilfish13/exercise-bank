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
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Open an account",
};

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Open an account</CardTitle>
        <CardDescription>
          Create your Eagle Bank account in a few seconds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <span>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
