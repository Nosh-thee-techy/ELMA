"use client";

import { IphoneShell } from "@/components/app/iphone-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader2, Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Turn = { role: "user" | "assistant"; content: string };

const DEFAULT_MODEL = "Qwen-Ambassador/Qwen3.8-plus";

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function ElmaVoiceChat({
  defaultWard = "Manyatta B",
  className,
}: {
  defaultWard?: string;
  className?: string;
}) {
  const [ward, setWard] = useState(defaultWard);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [models, setModels] = useState<string[]>([]);
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm ELMA. Ask about shelters, reporting floods, county funds, or policy. Tap the mic to speak.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    void fetch("/api/ai/chat")
      .then((r) => r.json())
      .then((data: { qwenModels?: string[] }) => {
        if (data.qwenModels?.length) {
          setModels(data.qwenModels);
          setModel((m) => (data.qwenModels!.includes(m) ? m : data.qwenModels![0]!));
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, loading]);

  const speak = useCallback((text: string) => {
    if (!speakReplies || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ""));
    utter.rate = 1;
    utter.lang = "en-KE";
    window.speechSynthesis.speak(utter);
  }, [speakReplies]);

  const sendMessage = useCallback(
    async (text: string, mode: "chat" | "voice") => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError("");
      const userTurn: Turn = { role: "user", content: trimmed };
      const nextTurns = [...turns, userTurn];
      setTurns(nextTurns);
      setDraft("");
      setLoading(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextTurns,
            ward,
            mode,
            model: models.length ? model : undefined,
          }),
        });
        const data = (await res.json()) as { message?: string; error?: string };
        if (!res.ok) {
          setError(data.error ?? "Could not get a reply.");
          return;
        }
        const reply = data.message ?? "No response.";
        setTurns((prev) => [...prev, { role: "assistant", content: reply }]);
        if (mode === "voice" || speakReplies) speak(reply);
      } catch {
        setError("Network error. Try again or use USSD *384*253#.");
      } finally {
        setLoading(false);
      }
    },
    [loading, model, models.length, speak, speakReplies, turns, ward],
  );

  const toggleListen = useCallback(() => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setError("Voice input needs Chrome or Edge on desktop/Android.");
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const rec = new Ctor();
    recognitionRef.current = rec;
    rec.lang = "en-KE";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) void sendMessage(transcript, "voice");
    };
    rec.onerror = () => {
      setListening(false);
      setError("Could not hear you. Check microphone permission.");
    };
    rec.onend = () => setListening(false);

    rec.start();
    setListening(true);
    setError("");
  }, [listening, sendMessage]);

  return (
    <div className={cn("flex w-full max-w-lg flex-col gap-4", className)}>
      <div className="flex flex-wrap items-end gap-3 px-1">
        <div className="flex min-w-[140px] flex-1 flex-col gap-1">
          <Label htmlFor="voice-ward" className="text-xs">
            Ward
          </Label>
          <Input
            id="voice-ward"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="h-9"
          />
        </div>
        {models.length > 0 ? (
          <div className="flex min-w-[160px] flex-1 flex-col gap-1">
            <Label htmlFor="voice-model" className="text-xs">
              Qwen model
            </Label>
            <Select value={model} onValueChange={(v) => v && setModel(v)}>
              <SelectTrigger id="voice-model" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((id) => (
                  <SelectItem key={id} value={id}>
                    {id.replace("Qwen-Ambassador/", "")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 shrink-0"
          aria-pressed={speakReplies}
          onClick={() => setSpeakReplies((s) => !s)}
          title={speakReplies ? "Mute spoken replies" : "Speak replies aloud"}
        >
          {speakReplies ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        </Button>
      </div>

      <IphoneShell label="ELMA Voice">
        <div ref={scrollRef} className="flex max-h-[min(52vh,480px)] flex-col gap-3 overflow-y-auto p-3">
          {turns.map((t, i) => (
            <div
              key={`${i}-${t.role}`}
              className={cn(
                "max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                t.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-muted text-foreground",
              )}
            >
              {t.content}
            </div>
          ))}
          {loading ? (
            <div className="mr-auto flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Thinking…
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 border-t border-border p-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type or use mic…"
            className="h-10 flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage(draft, "chat");
              }
            }}
          />
          <Button
            type="button"
            size="icon"
            variant={listening ? "destructive" : "outline"}
            className="size-10 shrink-0"
            aria-label={listening ? "Stop listening" : "Start voice input"}
            onClick={toggleListen}
            disabled={loading}
          >
            {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </Button>
          <Button
            type="button"
            size="icon"
            className="size-10 shrink-0"
            disabled={loading || draft.trim().length < 2}
            onClick={() => void sendMessage(draft, "chat")}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </IphoneShell>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <p className="text-center text-xs text-muted-foreground">
        Voice uses your browser microphone and speaker; answers are powered by Qwen on the server.
        Same assistant as Policy — tuned for hands-free IVR-style replies.
      </p>
    </div>
  );
}
