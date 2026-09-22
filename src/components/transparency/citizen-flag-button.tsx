"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CitizenFlagTarget } from "@/lib/types";
import { Flag, Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  targetType: CitizenFlagTarget;
  targetId: string;
  county?: string;
  ward?: string;
  label?: string;
};

export function CitizenFlagButton({
  targetType,
  targetId,
  county,
  ward,
  label = "Flag discrepancy",
}: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("Work not visible on ground");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/transparency/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          description,
          county,
          ward,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
        Flag submitted — audit desk will review.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit rounded-full font-bold"
        onClick={() => setOpen((o) => !o)}
      >
        <Flag data-icon="inline-start" className="size-3.5" />
        {label}
      </Button>
      {open ? (
        <div className="rounded-2xl border border-border bg-muted/40 p-4">
          <Label className="text-xs font-bold uppercase text-muted-foreground">Reason</Label>
          <input
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Label className="mt-3 text-xs font-bold uppercase text-muted-foreground">Details</Label>
          <Textarea
            className="mt-1 min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What you saw, when, and where (min 10 characters)"
          />
          <Button
            type="button"
            className="mt-3 rounded-full font-bold"
            disabled={loading || description.length < 10}
            onClick={() => void submit()}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Submit flag"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
