import Link from "next/link";
import {
  ArrowLeftRight,
  CreditCard,
  Receipt,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const actions: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "View accounts", href: "/accounts", Icon: CreditCard },
  { label: "Transactions", href: "/transactions", Icon: Receipt },
  { label: "Move money", href: "/transactions", Icon: ArrowLeftRight },
  { label: "Edit profile", href: "/profile", Icon: UserRound },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-2 gap-3">
          {actions.map(({ label, href, Icon }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex h-full flex-col items-start gap-2 rounded-lg border border-border bg-card p-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
