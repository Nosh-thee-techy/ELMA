"use client";

import { useLowBandwidth } from "@/components/providers/low-bandwidth-provider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MotionAlertCard({
  children,
  className,
  index = 0,
  pulse = false,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
  pulse?: boolean;
}) {
  const { lowBandwidth } = useLowBandwidth();

  if (lowBandwidth) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      className={cn(className, pulse && "motion-safe:animate-pulse")}
    >
      {children}
    </motion.div>
  );
}
