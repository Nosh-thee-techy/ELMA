import { AudiencePanel } from "@/components/layout/audience-panel";
import { audiencesForPath, metaForPath } from "@/lib/content/site";
import { cn } from "@/lib/utils";

type PageFrameProps = {
  pathname: string;
  children: React.ReactNode;
  className?: string;
  showAudience?: boolean;
  showIntro?: boolean;
};

export function PageFrame({
  pathname,
  children,
  className,
  showAudience = false,
  showIntro = false,
}: PageFrameProps) {
  const meta = metaForPath(pathname);
  const audiences = audiencesForPath(pathname);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {showIntro ? (
        <section className="elma-card p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">
            What we are building
          </p>
          <p className="mt-3 max-w-3xl text-base font-medium leading-relaxed text-muted-foreground">
            {meta.summary}
          </p>
        </section>
      ) : null}

      {showAudience && audiences.length > 0 ? (
        <AudiencePanel audiences={audiences} />
      ) : null}

      <div>{children}</div>
    </div>
  );
}
