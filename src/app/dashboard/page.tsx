import { HumanPhoto } from "@/components/media/human-photo";
import { ResponderQuickUpdate } from "@/components/dashboard/responder-quick-update";
import { elmaPhotos } from "@/lib/content/stock-images";
import { canEditShelter, getServerSession } from "@/lib/auth/session";
import { getShelters } from "@/lib/data/repository";
import Link from "next/link";

export default async function DashboardPage() {
  const { profile } = getServerSession();
  const shelters = await getShelters();
  const isVerifier = profile?.role === "VERIFIER";
  const assigned = profile
    ? isVerifier
      ? []
      : shelters.filter((s) => canEditShelter(profile, s))
    : shelters.filter((s) => s.county === "Kisumu");

  return (
    <div className="flex flex-col gap-6">
      <HumanPhoto
        src={elmaPhotos.responderField}
        alt="Construction site in Konza, Kenya — field infrastructure works"
        className="aspect-[2/1] w-full rounded-2xl ring-1 ring-border"
        sizes="400px"
      />
      <section>
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          {isVerifier ? "Audit desk" : "Live operations"}
        </p>
        <h1 className="text-2xl font-extrabold text-elma-navy dark:text-slate-50">
          {isVerifier ? "Verification console" : "Shelter triage"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {profile ? (
            <>
              Signed in as <span className="font-semibold">{profile.organization}</span> ·{" "}
              {profile.role === "VERIFIER"
                ? profile.organization
                : profile.role === "ADMIN"
                  ? profile.county
                  : `${profile.ward}, ${profile.county}`}
            </>
          ) : (
            "Demo responder view"
          )}
        </p>
      </section>

      {isVerifier ? (
        <p className="elma-card p-6 text-sm text-muted-foreground">
          Open the{" "}
          <Link href="/transparency" className="font-bold text-primary underline-offset-2 hover:underline">
            disbursal tracker
          </Link>{" "}
          and use <strong>Record verification</strong> on proof cards. Events append to the public audit
          trail and CSV export.
        </p>
      ) : null}

      {!isVerifier && assigned.length === 0 ? (
        <p className="elma-card p-6 text-sm text-muted-foreground">
          No shelters assigned to your ward in the demo dataset.
        </p>
      ) : !isVerifier ? (
        <ul className="flex flex-col gap-4">
          {assigned.map((shelter) => (
            <li key={shelter.id}>
              <ResponderQuickUpdate shelter={shelter} />
            </li>
          ))}
        </ul>
      ) : null}

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
