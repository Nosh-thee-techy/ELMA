"use client";

import { useLowBandwidth } from "@/components/providers/low-bandwidth-provider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function MotionSection({ children, className, delay = 0 }: MotionSectionProps) {
  const { lowBandwidth } = useLowBandwidth();

  if (lowBandwidth) {
    return <section className={cn(className)}>{children}</section>;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
