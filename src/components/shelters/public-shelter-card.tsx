import { CitizenFlagButton } from "@/components/transparency/citizen-flag-button";
import { ShelterStatusBadge } from "@/components/shelters/shelter-status-badge";
import { withShelterStatus } from "@/lib/shelter/status";
import type { Shelter } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { MapPin, Phone } from "lucide-react";
export function PublicShelterCard({ shelter }: { shelter: Shelter }) {
  const s = withShelterStatus(shelter);
  const status = s.status ?? "OPEN";
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;
  const hotline = s.hotline ?? "1199";

  return (
    <article className="elma-card flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-extrabold text-elma-navy dark:text-slate-50">{s.name}</h3>
          <p className="text-sm text-muted-foreground">
            {s.ward} · {s.county}
          </p>
        </div>
        <ShelterStatusBadge occupancy={s.occupancy} capacity={s.capacity} status={status} />
      </div>
      <p className="text-sm text-muted-foreground">{s.address}</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl font-bold")}
        >
          <MapPin data-icon="inline-start" />
          Get directions
        </a>
        <a
          href={`tel:${hotline.replace(/\s/g, "")}`}
          className={cn(buttonVariants({ size: "sm" }), "rounded-xl bg-emerald-600 font-bold hover:bg-emerald-500")}
        >
          <Phone data-icon="inline-start" />
          Call {hotline}
        </a>
      </div>
      {s.resourceNeeds && s.resourceNeeds.length > 0 ? (
        <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
          Needs: {s.resourceNeeds.join(", ")}
        </p>
      ) : null}
      <CitizenFlagButton
        targetType="shelter"
        targetId={s.id}
        county={s.county}
        ward={s.ward}
        label="Report wrong status"
      />
    </article>
  );
}
