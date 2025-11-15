"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "../../utils/utils";

// --- internal context to coordinate highlight position ---
type TabsHighlightContextType = {
  activeValue?: string;
  triggers: Record<string, HTMLButtonElement | null>;
  registerTrigger: (value: string, ref: HTMLButtonElement | null) => void;
};

const TabsHighlightContext =
  React.createContext<TabsHighlightContextType | null>(null);

// Root
export function Tabs({
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [activeValue, setActiveValue] = React.useState<string | undefined>(
    (value as string | undefined) ?? (defaultValue as string | undefined)
  );
  const [triggers, setTriggers] = React.useState<
    Record<string, HTMLButtonElement | null>
  >({});

  // keep local activeValue in sync with controlled value
  React.useEffect(() => {
    if (typeof value === "string") {
      setActiveValue(value);
    }
  }, [value]);

  const handleValueChange = (nextValue: string) => {
    setActiveValue(nextValue);
    onValueChange?.(nextValue);
  };

  const registerTrigger = React.useCallback(
    (val: string, ref: HTMLButtonElement | null) => {
      setTriggers((prev) => {
        if (prev[val] === ref) return prev;
        return { ...prev, [val]: ref };
      });
    },
    []
  );

  return (
    <TabsHighlightContext.Provider
      value={{ activeValue, triggers, registerTrigger }}
    >
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col gap-4", className)}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        {...props}
      />
    </TabsHighlightContext.Provider>
  );
}

// List – dark pill bar with animated background pill
export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const ctx = React.useContext(TabsHighlightContext);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [pillStyle, setPillStyle] = React.useState<React.CSSProperties>();

  React.useEffect(() => {
    if (!ctx?.activeValue || !listRef.current) return;
    const activeEl = ctx.triggers[ctx.activeValue];
    if (!activeEl) return;

    const listRect = listRef.current.getBoundingClientRect();
    const triggerRect = activeEl.getBoundingClientRect();

    setPillStyle({
      left: triggerRect.left - listRect.left,
      top: triggerRect.top - listRect.top,
      width: triggerRect.width,
      height: triggerRect.height,
    });
  }, [ctx?.activeValue, ctx?.triggers]);

  return (
    <div className="relative">
      <TabsPrimitive.List
        ref={listRef}
        data-slot="tabs-list"
        className={cn(
          "relative inline-flex w-full items-center justify-between rounded-xl bg-[#1A1A1D] border border-[#262629] p-1 shadow-[0_14px_35px_rgba(0,0,0,0.55)] backdrop-blur-sm",
          className
        )}
        {...props}
      >
        {/* animated gradient pill under active tab */}
        {pillStyle && (
          <motion.span
            layoutId="tabs-pill"
            transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
            style={pillStyle}
            className="absolute z-0 rounded-lg bg-gradient-to-r from-[#FF2D2D] to-[#FF4747] shadow-[0_10px_26px_rgba(255,45,45,0.45)]"
          />
        )}

        {props.children}
      </TabsPrimitive.List>
    </div>
  );
}

// Trigger – text over the animated pill
export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const ctx = React.useContext(TabsHighlightContext);
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const value = (props as any).value as string | undefined;

  React.useEffect(() => {
    if (!ctx || !value) return;
    ctx.registerTrigger(value, ref.current);
  }, [ctx, value]);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-9 flex-1 items-center justify-center gap-1.5",
        "rounded-lg px-3 text-sm font-medium whitespace-nowrap",
        "text-[#9A9AA2] transition-all duration-200 ease-out",
        "hover:text-[#E6E6E9]",
        "data-[state=active]:text-[#E6E6E9]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D2D]/60 focus-visible:ring-offset-0",
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{props.children}</span>
    </TabsPrimitive.Trigger>
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
