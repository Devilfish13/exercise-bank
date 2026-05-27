import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TextFieldProps = React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
};

export function TextField({ id, label, error, ...props }: TextFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
