"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function PolicyExplainer({
  defaultWard,
  sampleText,
}: {
  defaultWard: string;
  sampleText: string;
}) {
  const [ward, setWard] = useState(defaultWard);
  const [policyText, setPolicyText] = useState(sampleText);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function explain() {
    setLoading(true);
    setResult("");
    setError("");
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyText, ward }),
      });
      const data = (await res.json()) as { explanation?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not explain this text.");
        return;
      }
      setResult(data.explanation ?? "No response");
    } catch {
      setError("Network error. Try lite mode or read the sample bullets on the home page.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Paste policy text</CardTitle>
          <CardDescription>
            Dense county PDFs become ward-specific steps your neighbors can act on.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ward">Your ward</Label>
            <Input
              id="ward"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="min-h-11 max-w-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="policy">Policy or PDF excerpt</Label>
            <Textarea
              id="policy"
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              rows={10}
              className="min-h-[12rem] font-mono text-sm leading-relaxed"
            />
          </div>
          <Button
            type="button"
            onClick={explain}
            disabled={loading || policyText.length < 40}
            size="lg"
            className="min-h-11 w-full sm:w-auto"
          >
            <Sparkles data-icon="inline-start" />
            {loading ? "Explaining…" : "Explain in plain language"}
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {result && !loading ? (
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Plain-language summary</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {result}
            </article>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
