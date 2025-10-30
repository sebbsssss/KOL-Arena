import * as React from "react";
import { cn } from "@/lib/utils";

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function Item({
  className,
  leading,
  trailing,
  title,
  description,
  children,
  ...props
}: ItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-card p-3 text-card-foreground",
        className
      )}
      {...props}
    >
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="flex-1 min-w-0">
        {title ? (
          <div className="text-sm font-medium leading-none truncate">{title}</div>
        ) : null}
        {description ? (
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {description}
          </div>
        ) : null}
        {children}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}

export default Item;


