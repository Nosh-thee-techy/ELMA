import { cn } from "@/lib/utils";

export function ElmaLogo({
  className,
  showWordmark = true,
  variant = "light",
}: {
  className?: string;
  showWordmark?: boolean;
  variant?: "light" | "dark";
}) {
  const text = variant === "light" ? "text-white" : "text-elma-navy";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <defs>
          <linearGradient id="elma-mark" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#0d9488" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#elma-mark)" />
        <path
          d="M18 8L26 12V19C26 24 22 27.5 18 29C14 27.5 10 24 10 19V12L18 8Z"
          className="fill-white/95"
        />
        <circle cx="18" cy="17" r="3.5" className="fill-emerald-600" />
        <path
          d="M18 14V20M15.5 17H20.5"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark ? (
        <span className={cn("flex flex-col leading-none", text)}>
          <span className="text-lg font-extrabold tracking-[0.2em]">ELMA</span>
          <span
            className={cn(
              "mt-0.5 hidden text-[9px] font-semibold tracking-wide sm:block",
              variant === "light" ? "text-white/65" : "text-muted-foreground",
            )}
          >
            Monitoring & Accountability
          </span>
        </span>
      ) : null}
    </span>
  );
}
