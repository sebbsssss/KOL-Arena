import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Empty({
  className,
  icon,
  title = "Nothing here yet",
  description,
  actions,
  ...props
}: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-center",
        "rounded-lg border bg-card p-6 text-card-foreground",
        className
      )}
      {...props}
    >
      {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      <h3 className="text-sm font-medium">{title}</h3>
      {description ? (
        <p className="text-sm text-muted-foreground max-w-prose">{description}</p>
      ) : null}
      {actions ? <div className="mt-2">{actions}</div> : null}
    </div>
  );
}

export default Empty;


