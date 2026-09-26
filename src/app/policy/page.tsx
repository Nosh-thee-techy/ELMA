import { PageHero } from "@/components/layout/page-hero";
import { PolicyExplainer } from "@/components/policy/policy-explainer";
import { DEMO_COUNTY, samplePolicyText } from "@/lib/data/seed";

export default function PolicyPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHero
        variant="minimal"
        eyebrow="Qwen-powered"
        title="Policy in plain language"
        description="Paste county PDF excerpts — ELMA rewrites them into ward-specific steps your neighbors can act on today."
      />
      <PolicyExplainer defaultWard="Manyatta B" sampleText={samplePolicyText} />
      <p className="text-xs text-muted-foreground">
        Demo county: {DEMO_COUNTY}. Set QWEN_API_KEY on the server for live summaries.
      </p>
    </div>
  );
}
