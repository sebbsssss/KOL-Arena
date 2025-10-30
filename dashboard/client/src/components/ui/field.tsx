import * as React from "react";
import { cn } from "@/lib/utils";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
}

export function Field({
  className,
  label,
  description,
  error,
  required,
  children,
  ...props
}: FieldProps) {
  const describedById = React.useId();
  const errorId = React.useId();

  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      {label ? (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </label>
      ) : null}

      {children}

      {description ? (
        <p id={describedById} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default Field;


