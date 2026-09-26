import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { ResponderQuickUpdate } from "@/components/dashboard/responder-quick-update";
import { SosQueuePanel } from "@/components/dashboard/sos-queue-panel";
import {
  canAccessReport,
  canEditShelter,
  canUpdateReportStatus,
  getServerSession,
} from "@/lib/auth/session";
import { getEmergencyReports, getShelters } from "@/lib/data/repository";
import Link from "next/link";

export default async function DashboardPage() {
  const { profile } = getServerSession();
  const [shelters, allReports] = await Promise.all([getShelters(), getEmergencyReports()]);

  const isVerifier = profile?.role === "VERIFIER";
  const assigned = profile
    ? isVerifier
      ? []
      : shelters.filter((s) => canEditShelter(profile, s))
    : shelters.filter((s) => s.county === "Kisumu");

  const scopedReports = profile
    ? allReports.filter((r) => canAccessReport(profile, r))
    : allReports.filter((r) => r.county === "Kisumu");

  const openSos = scopedReports.filter((r) => r.status === "open").length;

  const totalOcc = assigned.reduce((n, s) => n + s.occupancy, 0);
  const totalCap = assigned.reduce((n, s) => n + s.capacity, 0);
  const pct = totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0;

  const orgLine = profile
    ? profile.role === "VERIFIER"
      ? profile.organization
      : profile.role === "ADMIN"
        ? profile.county
        : `${profile.ward}, ${profile.county}`
    : "Demo responder view";

  const canUpdateSos = profile ? canUpdateReportStatus(profile) : false;

  return (
    <div className="flex flex-col gap-6">
      <DashboardHero
        eyebrow={isVerifier ? "Audit desk" : "Live operations"}
        title={isVerifier ? "Verification console" : "Shelter triage & SOS"}
        description={
          profile
            ? `${profile.organization} · ${orgLine}. USSD/SMS/web reports land in the SOS queue; shelter updates sync to *384*253#.`
            : "Sign in to scope updates to your ward. Demo shows Kisumu shelters and reports."
        }
        stats={
          isVerifier
            ? [{ label: "Open SOS", value: String(openSos), icon: "activity" }]
            : [
                { label: "Open SOS", value: String(openSos), icon: "activity" },
                { label: "Sites", value: String(assigned.length), icon: "map" },
                { label: "Capacity", value: `${pct}%`, icon: "users" },
              ]
        }
      />

      <SosQueuePanel reports={scopedReports} canUpdate={canUpdateSos} />

      {isVerifier ? (
        <div className="elma-card border-teal-500/20 bg-gradient-to-br from-card to-teal-500/5 p-6 text-sm leading-relaxed text-muted-foreground">
          Open the{" "}
          <Link href="/explore" className="font-bold text-primary underline-offset-2 hover:underline">
            county map
          </Link>{" "}
          or{" "}
          <Link
            href="/transparency"
            className="font-bold text-primary underline-offset-2 hover:underline"
          >
            disbursal tracker
          </Link>{" "}
          and use <strong className="text-foreground">Record verification</strong> on proof cards.
          Events append to the public audit trail and CSV export.
        </div>
      ) : null}

      {!isVerifier && assigned.length === 0 ? (
        <p className="elma-card p-6 text-sm text-muted-foreground">
          No shelters assigned to your ward in the demo dataset.
        </p>
      ) : !isVerifier ? (
        <ul className="flex flex-col gap-5">
          {assigned.map((shelter) => (
            <li key={shelter.id}>
              <ResponderQuickUpdate shelter={shelter} />
            </li>
          ))}
        </ul>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/explore" className="font-semibold text-primary underline-offset-2 hover:underline">
          Public map
        </Link>
        {" · "}
        <Link
          href="/channels/phone"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          USSD lab
        </Link>
      </p>
    </div>
  );
}
