"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { EmergencyReport } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

const categories = [
  { value: "trapped", label: "Trapped / need rescue" },
  { value: "flooding", label: "Flooding / water rising" },
  { value: "landslide", label: "Landslide / mudslide" },
  { value: "medical", label: "Medical emergency" },
  { value: "infrastructure", label: "Bridge / road failure" },
  { value: "other", label: "Other" },
] as const;

export function ReportForm({
  defaultCounty,
  embedded = false,
  onSuccess,
}: {
  defaultCounty: string;
  embedded?: boolean;
  onSuccess?: (report: EmergencyReport) => void;
}) {
  const [category, setCategory] = useState<string>("flooding");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(e.currentTarget);
    const payload = {
      category,
      description: form.get("description"),
      ward: form.get("ward"),
      county: form.get("county"),
      contact: form.get("contact") || undefined,
    };

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      const body = (await res.json()) as { report: EmergencyReport };
      setStatus("done");
      setMessage(
        `Report received. Ref ${body.report.id.slice(0, 8)} — ward responders see it in the queue.`,
      );
      onSuccess?.(body.report);
      e.currentTarget.reset();
      setCategory("flooding");
    } catch {
      setStatus("error");
      setMessage("Could not send. Try again or use SMS/voice backup if available.");
    }
  }

  const formBody = (
    <form onSubmit={onSubmit} className={cn("flex flex-col", embedded ? "gap-2.5" : "gap-4")}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Emergency type</Label>
            <Select
              value={category}
              onValueChange={(value) => {
                if (value) setCategory(value);
              }}
            >
              <SelectTrigger id="category" className={cn("w-full", embedded ? "h-9" : "min-h-11")}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="county">County</Label>
              <Input
                id="county"
                name="county"
                required
                defaultValue={defaultCounty}
                className={embedded ? "h-9" : "min-h-11"}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ward">Ward</Label>
              <Input
                id="ward"
                name="ward"
                required
                placeholder="e.g. Nyalenda A"
                className={embedded ? "h-9" : "min-h-11"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">What is happening?</Label>
            <Textarea
              id="description"
              name="description"
              required
              minLength={10}
              rows={embedded ? 2 : 4}
              className={embedded ? "min-h-16 resize-none" : "min-h-[7rem] resize-y"}
              placeholder="Water at waist level on Ring Road near stage…"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact">Callback number (optional)</Label>
            <Input
              id="contact"
              name="contact"
              inputMode="tel"
              className={embedded ? "h-9" : "min-h-11"}
              placeholder="07xx xxx xxx"
            />
          </div>

          <Button
            type="submit"
            variant="destructive"
            size="lg"
            className={cn(
              "w-full bg-destructive text-destructive-foreground hover:bg-destructive/90",
              embedded ? "h-10" : "min-h-12",
            )}
            disabled={false}
          >
            Send emergency report
          </Button>

      {message ? (
        <Alert
          variant={status === "error" ? "destructive" : "default"}
          className={status === "done" ? "border-primary/30 bg-primary/5" : undefined}
        >
          {status === "done" ? <CheckCircle2 className="text-primary" /> : null}
          {status === "error" ? <Loader2 className="opacity-0" aria-hidden /> : null}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  );

  if (status === "sending") {
    const loading = (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
    if (embedded) return loading;
    return (
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Sending report</CardTitle>
          <CardDescription>Queuing your message for ward responders…</CardDescription>
        </CardHeader>
        <CardContent>{loading}</CardContent>
      </Card>
    );
  }

  if (embedded) {
    return <div className={cn("rounded-xl border border-border/80 bg-card p-3 shadow-sm")}>{formBody}</div>;
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-xl">Emergency report</CardTitle>
        <CardDescription>
          Short form, thumb-friendly fields. Works in lite mode on slow networks.
        </CardDescription>
      </CardHeader>
      <CardContent>{formBody}</CardContent>
    </Card>
  );
}
