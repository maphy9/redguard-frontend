"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../utils/utils";

// Root
export function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

// List – dark pill bar with subtle depth
export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex w-full items-center justify-between rounded-xl bg-[#1A1A1D] border border-[#262629] p-1 shadow-[0_14px_35px_rgba(0,0,0,0.55)]",
        "backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

// Trigger – 3D pill, animated on active / hover
export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-9 flex-1 items-center justify-center gap-1.5",
        "rounded-lg px-2 text-sm font-medium whitespace-nowrap",
        "text-[#9A9AA2] transition-all duration-250 ease-out",
        "border border-transparent",
        "hover:text-[#E6E6E9]",
        // active state
        "data-[state=active]:bg-[#FF2D2D]",
        "data-[state=active]:text-[#E6E6E9]",
        "data-[state=active]:shadow-[0_10px_26px_rgba(255,45,45,0.45)]",
        "data-[state=active]:translate-y-[-1px] data-[state=active]:scale-[1.02]",
        // focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D2D]/60 focus-visible:ring-offset-0",
        // disabled
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}

// Content – smooth fade + slight slide
export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none",
        "data-[state=active]:opacity-100 data-[state=active]:translate-y-0",
        "data-[state=inactive]:opacity-0 data-[state=inactive]:translate-y-2",
        "data-[state=inactive]:pointer-events-none",
        "transition-all duration-300 ease-out",
        className
      )}
      {...props}
    />
  );
}
