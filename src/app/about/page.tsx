import { VisionSections } from "@/components/about/vision-sections";
import { PageFrame } from "@/components/layout/page-frame";

export default function AboutPage() {
  return (
    <PageFrame pathname="/about">
      <VisionSections />
    </PageFrame>
  );
}
