import React, { forwardRef } from "react";
import { cn } from "../services/tailwind.utils";

interface Props {
  children: React.ReactNode;
  className?: string;

  style?: React.CSSProperties;
}

const ListboxWrapper = forwardRef<HTMLDivElement, Props>(
  ({ children, className, style }: Props, ref) => {
    return (
      <div
        style={style}
        ref={ref}
        className={cn(
          `w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 ${className}`
        )}
      >
        {children}
      </div>
    );
  }
);

export default ListboxWrapper;
