import { Logo } from "@/components/layout/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
