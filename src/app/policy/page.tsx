import { PageFrame } from "@/components/layout/page-frame";
import { PolicyExplainer } from "@/components/policy/policy-explainer";
import { DEMO_COUNTY, samplePolicyText } from "@/lib/data/seed";

export default function PolicyPage() {
  return (
    <PageFrame pathname="/policy">
      <PolicyExplainer defaultWard="Manyatta B" sampleText={samplePolicyText} />
      <p className="text-xs text-muted-foreground">
        Demo county: {DEMO_COUNTY}. Set OPENROUTER_API_KEY in .env.local for live AI summaries.
      </p>
    </PageFrame>
  );
}
