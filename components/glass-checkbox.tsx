"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// 1. Updated variants to match your exact Radio button animation
const indicatorVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  checked: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      visualDuration: 0.2,
      bounce: 0.5,
    },
  },
};

export interface GlassCheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  label?: string;
}

const GlassCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  GlassCheckboxProps
>(({ className, label, id, ...props }, ref) => {
  // Generate a fallback ID if one isn't provided
  const checkboxId = id || `glass-checkbox-${crypto.randomUUID()}`;

  return (
    <div className="flex items-center gap-3">
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          // 2. Applied the exact same base styling as your Radio item
          "group relative aspect-square rounded-full flex items-center justify-center",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:border-[#ECFD01]/60",
          className,
        )}
        {...props}
      >
        {/* 3. UNCHECKED STATE: A hollow ring outline */}
        <div className="h-2 w-2 rounded-full border border-[#D9D9D9] transition-opacity duration-200 group-data-[state=checked]:opacity-0" />

        {/* 4. CHECKED STATE: A solid yellow dot */}
        <CheckboxPrimitive.Indicator className="absolute flex w-full h-full items-center justify-center">
          <motion.div
            className="h-2 w-2 rounded-full bg-[#ECFD01]" // Exact hex from your radio
            initial="initial"
            animate="checked"
            variants={indicatorVariants}
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <label
          htmlFor={checkboxId}
          className="font-medium text-[#8C8C8C] has-data-[state=checked]:text-white cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
});
GlassCheckbox.displayName = CheckboxPrimitive.Root.displayName;

export { GlassCheckbox };
