import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function ButtonGroup({
  className,
  orientation = "horizontal",
  children,
  ...props
}: ButtonGroupProps) {
  const isVertical = orientation === "vertical";
  return (
    <div
      className={cn(
        "inline-flex",
        isVertical ? "flex-col" : "flex-row",
        "rounded-md border bg-background",
        className
      )}
      role="group"
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        const total = React.Children.count(children);
        const first = index === 0;
        const last = index === total - 1;
        const radiusClasses = isVertical
          ? cn(first && "rounded-t-md", last && "rounded-b-md", !first && !last && "rounded-none")
          : cn(first && "rounded-l-md", last && "rounded-r-md", !first && !last && "rounded-none");
        const dividerClasses = isVertical ? "border-t" : "border-l";

        return React.cloneElement(child as any, {
          className: cn(
            "border-0",
            !first && dividerClasses,
            radiusClasses,
            (child as any).props?.className
          ),
        });
      })}
    </div>
  );
}

export default ButtonGroup;


