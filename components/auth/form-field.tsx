import { cn } from "@/lib/utils";

interface FormFieldProps extends React.ComponentProps<"input"> {
  label: string;
  name: string;
  errors?: string[];
  hint?: string;
}

export function FormField({
  label,
  name,
  errors,
  hint,
  className,
  ...props
}: FormFieldProps) {
  const hasErrors = Boolean(errors?.length);
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const describedBy =
    [hint ? hintId : null, hasErrors ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={hasErrors || undefined}
        aria-describedby={describedBy}
        className={cn(
          "mt-2 h-11 w-full rounded-xl border bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring",
          hasErrors
            ? "border-red-300 focus-visible:ring-red-300"
            : "border-border",
          className,
        )}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {errors && errors.length > 0 ? (
        <ul id={errorId} className="mt-1.5 space-y-1 text-xs leading-5 text-red-700">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
