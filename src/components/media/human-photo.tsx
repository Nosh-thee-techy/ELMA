import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** Remote photos — native img avoids optimizer/404 edge cases with Unsplash. */
export function HumanPhoto({ src, alt, className, priority }: Props) {
  return (
    <div className={cn("relative min-h-32 overflow-hidden bg-muted", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-elma-navy/45 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}
