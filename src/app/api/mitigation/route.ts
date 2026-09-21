import { getMitigationProjects } from "@/lib/data/repository";
import { NextResponse } from "next/server";

export async function GET() {
  const projects = await getMitigationProjects();
  const totalBudget = projects.reduce((s, p) => s + p.budgetKes, 0);
  const mismatch = projects.filter(
    (p) => p.paperStatus === "complete" && p.fieldStatus !== "confirmed",
  ).length;

  return NextResponse.json({
    projects,
    summary: {
      totalBudgetKes: totalBudget,
      projectCount: projects.length,
      paperVsFieldMismatches: mismatch,
    },
  });
}
