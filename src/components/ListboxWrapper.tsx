import React, { forwardRef } from "react";
import { cn } from "../services/tailwind.utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ListboxWrapper = forwardRef<HTMLDivElement, Props>(
  ({ children, className }: Props, ref) => {
    return (
      <div
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
