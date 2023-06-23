import { TopMainContent } from "@/components/top-main-content";
import VerificationPipeline from "@/components/verification-pipeline";

export default function VerificationUUIDPage() {
  return (
    <>
      <TopMainContent title="Verification" step={4} />
      <VerificationPipeline />
    </>
  );
}
