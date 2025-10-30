import * as React from "react";
import { cn } from "@/lib/utils";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-md border bg-muted px-1.5 py-0.5",
        "text-xs font-medium text-muted-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export default Kbd;


