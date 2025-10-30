import * as React from "react";
import { cn } from "@/lib/utils";

export function InputGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-stretch rounded-md border bg-background text-foreground",
        "focus-within:ring-2 focus-within:ring-ring",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function InputAddon({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-3 text-sm text-muted-foreground border-r bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function InputAppend({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-3 text-sm text-muted-foreground border-l bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}


