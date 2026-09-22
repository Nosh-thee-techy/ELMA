"use client";

import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProofVerifyButton({
  proofId,
  canVerify,
}: {
  proofId: string;
  canVerify: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  if (!canVerify) return null;

  async function verify() {
    setLoading(true);
    try {
      const res = await fetch(`/api/transparency/proofs/${proofId}/verify`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      setOk(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
        Verification recorded on audit trail.
      </p>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      className="rounded-full font-bold"
      disabled={loading}
      onClick={() => void verify()}
    >
      {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck data-icon="inline-start" />}
      Record verification
    </Button>
  );
}
