type AvatarProps = {
  fullName: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASSES = {
  sm: "size-8 text-sm",
  md: "size-16 text-xl",
  lg: "size-24 text-3xl",
};

export function Avatar({ fullName, avatarUrl, size = "md" }: AvatarProps) {
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- src is a base64 data URL; next/image cannot process data: URIs
      <img
        src={avatarUrl}
        alt={fullName}
        className={`${SIZE_CLASSES[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${SIZE_CLASSES[size]} flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground`}
      aria-label={`${fullName} avatar`}
    >
      {initials}
    </div>
  );
}
