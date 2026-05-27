import Link from "next/link";
import { Landmark } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type LogoProps = {
  href?: string;
  className?: string;
  showWordmark?: boolean;
};

export function Logo({
  href = "/",
  className,
  showWordmark = true,
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "inline-flex items-center gap-2 rounded-md font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Landmark className="size-5" aria-hidden="true" />
      </span>
      {showWordmark ? (
        <span className="text-lg text-foreground">{siteConfig.name}</span>
      ) : null}
    </Link>
  );
}
