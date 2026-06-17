"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const indicatorVariants = {
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

const GlassRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
      ref={ref}
    />
  );
});
GlassRadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface GlassRadioGroupItemProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> {
  label?: string;
}

const GlassRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  GlassRadioGroupItemProps
>(({ className, label, id, ...props }, ref) => {
  const radioId = id || `glass-radio-${props.value}`;

  return (
    <div className="flex items-center gap-3">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={radioId}
        className={cn(
          "group relative aspect-square rounded-full flex items-center justify-center",
          // "bg-white/10 backdrop-blur-xl border border-white/30",
          // "shadow-[0_2px_8px_rgba(0,0,0,0.2)]",
          // "transition-all duration-200",
          // "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:border-[#ECFD01]/60",
          className,
        )}
        {...props}
      >
        {/* 1. UNCHECKED STATE: A hollow ring outline */}
        <div className="h-2 w-2 rounded-full border border-[#D9D9D9] transition-opacity duration-200 group-data-[state=checked]:opacity-0" />

        {/* 2. CHECKED STATE: A solid yellow dot (the color is already correct) */}
        <RadioGroupPrimitive.Indicator className="absolute flex w-full h-full items-center justify-center">
          <motion.div
            className="h-2 w-2 rounded-full bg-[#ECFD01]" // Use exact hex from original code
            initial="initial"
            animate="checked"
            variants={indicatorVariants as Variants}
          />
        </RadioGroupPrimitive.Indicator>
        {/* --------------------------- */}
      </RadioGroupPrimitive.Item>

      {label && (
        <label
          htmlFor={radioId}
          className="text-sm font-medium text-white/80 cursor-pointer select-none"
        >
          {label}
        </label>
      )}
    </div>
  );
});
GlassRadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { GlassRadioGroup, GlassRadioGroupItem };
