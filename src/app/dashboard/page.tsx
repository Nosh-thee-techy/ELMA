import { ResponderQuickUpdate } from "@/components/dashboard/responder-quick-update";
import { canEditShelter, getServerSession } from "@/lib/auth/session";
import { getShelters } from "@/lib/data/repository";
import Link from "next/link";

export default async function DashboardPage() {
  const { profile } = getServerSession();
  const shelters = await getShelters();
  const assigned = profile
    ? shelters.filter((s) => canEditShelter(profile, s))
    : shelters.filter((s) => s.county === "Kisumu");

  return (
    <div className="flex flex-col gap-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          Live operations
        </p>
        <h1 className="text-2xl font-extrabold text-elma-navy dark:text-slate-50">
          Shelter triage
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {profile ? (
            <>
              Signed in as <span className="font-semibold">{profile.organization}</span> ·{" "}
              {profile.role === "ADMIN" ? profile.county : `${profile.ward}, ${profile.county}`}
            </>
          ) : (
            "Demo responder view"
          )}
        </p>
      </section>

      {assigned.length === 0 ? (
        <p className="elma-card p-6 text-sm text-muted-foreground">
          No shelters assigned to your ward in the demo dataset.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {assigned.map((shelter) => (
            <li key={shelter.id}>
              <ResponderQuickUpdate shelter={shelter} />
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-muted-foreground">
        <Link href="/transparency" className="font-semibold text-primary underline-offset-2 hover:underline">
          Public disbursal tracker
        </Link>{" "}
        ·{" "}
        <Link href="/shelters" className="font-semibold text-primary underline-offset-2 hover:underline">
          Citizen shelter view
        </Link>
      </p>
    </div>
  );
}
