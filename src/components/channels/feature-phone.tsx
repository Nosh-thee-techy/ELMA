"use client";

import { cn } from "@/lib/utils";
import { Loader2, Signal } from "lucide-react";
import { useCallback, useId, useState } from "react";

type Mode = "ussd" | "sms";

type Props = {
  mode: Mode;
  className?: string;
};

function formatScreen(text: string): string[] {
  return text.split("\n").slice(0, 6);
}

export function FeaturePhone({ mode, className }: Props) {
  const sessionId = useId().replace(/:/g, "");
  const [phoneNumber] = useState("254712345678");
  const [screenLines, setScreenLines] = useState<string[]>([
    "ELMA Demo",
    mode === "ussd" ? "Dial *384*253#" : "SMS to 40101",
    "Press keys below",
  ]);
  const [terminal, setTerminal] = useState(false);
  const [ussdPath, setUssdPath] = useState("");
  const [smsDraft, setSmsDraft] = useState("REPORT|flooding|Kondele|Water rising near stage, need help");
  const [pendingKeys, setPendingKeys] = useState("");
  const [loading, setLoading] = useState(false);
  const [inbox, setInbox] = useState<{ dir: "in" | "out"; text: string }[]>([]);

  const showUssd = useCallback(
    async (text: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/ussd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            phoneNumber,
            serviceCode: "*384*253#",
            text,
          }),
        });
        const raw = await res.text();
        const isEnd = raw.startsWith("END ");
        const isCon = raw.startsWith("CON ");
        const body = raw.replace(/^(CON|END)\s/, "");
        setScreenLines(formatScreen(body));
        setTerminal(isEnd);
        if (isEnd) {
          setUssdPath("");
        } else if (isCon) {
          setUssdPath(text);
        }
      } finally {
        setLoading(false);
      }
    },
    [phoneNumber, sessionId],
  );

  async function dialUssd() {
    setPendingKeys("");
    setTerminal(false);
    await showUssd("");
  }

  async function sendUssdSelection() {
    if (terminal) {
      await dialUssd();
      return;
    }
    const next = ussdPath === "" ? pendingKeys : `${ussdPath}*${pendingKeys}`;
    setPendingKeys("");
    await showUssd(next);
  }

  async function sendUssdFreeText() {
    if (!pendingKeys.trim()) return;
    const next =
      ussdPath === "" ? pendingKeys : `${ussdPath}*${pendingKeys.trim()}`;
    setPendingKeys("");
    await showUssd(next);
  }

  async function sendSms() {
    setLoading(true);
    setInbox((m) => [...m, { dir: "out", text: smsDraft }]);
    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: phoneNumber, message: smsDraft }),
      });
      const data = (await res.json()) as { reply: string };
      setInbox((m) => [...m, { dir: "in", text: data.reply }]);
      setScreenLines(formatScreen(data.reply));
      setTerminal(true);
    } finally {
      setLoading(false);
    }
  }

  function pressKey(key: string) {
    if (mode === "sms") {
      setSmsDraft((d) => d + key);
      return;
    }
    setPendingKeys((p) => p + key);
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative w-[280px] rounded-[2.5rem] bg-gradient-to-b from-slate-700 to-slate-900 p-3 shadow-2xl ring-4 ring-slate-950/40">
        <div className="mb-2 flex items-center justify-between px-3 pt-1 text-[10px] font-bold text-slate-300">
          <span className="flex items-center gap-1">
            <Signal className="size-3" aria-hidden />
            Safaricom
          </span>
          <span>12:34</span>
          <span>100%</span>
        </div>

        <div className="mx-1 rounded-lg border-2 border-slate-600 bg-[#9cb87a] p-2 shadow-inner">
          <div className="min-h-[140px] font-mono text-[11px] leading-snug text-[#1a2e12]">
            {loading ? (
              <p className="flex items-center gap-2 pt-8 text-center text-xs">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Connecting…
              </p>
            ) : (
              screenLines.map((line, i) => (
                <p key={`${line}-${i}`} className="whitespace-pre-wrap break-words">
                  {line}
                </p>
              ))
            )}
            {mode === "ussd" && !terminal && pendingKeys ? (
              <p className="mt-2 border-t border-[#1a2e12]/20 pt-1 font-bold">{pendingKeys}_</p>
            ) : null}
          </div>
        </div>

        {mode === "sms" ? (
          <div className="mx-1 mt-2 max-h-24 overflow-y-auto rounded bg-slate-800/80 p-2 text-[10px] text-slate-200">
            {inbox.length === 0 ? (
              <p className="text-slate-400">Inbox empty — send a message</p>
            ) : (
              inbox.map((m, i) => (
                <p key={i} className={m.dir === "out" ? "text-emerald-300" : "text-white"}>
                  {m.dir === "out" ? "You: " : "40101: "}
                  {m.text}
                </p>
              ))
            )}
          </div>
        ) : null}

        <div className="mt-3 grid grid-cols-3 gap-1.5 px-2 pb-2">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => pressKey(k)}
              className="flex h-11 items-center justify-center rounded-lg bg-slate-600 text-lg font-bold text-white shadow active:bg-slate-500"
            >
              {k}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <button
            type="button"
            className="rounded-lg bg-slate-700 px-3 py-2 text-[10px] font-bold uppercase text-slate-200"
            onClick={() => {
              if (mode === "ussd") {
                setPendingKeys("");
                void dialUssd();
              } else {
                setSmsDraft("HELP");
              }
            }}
          >
            Menu
          </button>
          <button
            type="button"
            className="flex size-14 items-center justify-center rounded-full bg-emerald-600 shadow-lg ring-2 ring-emerald-400/50 active:bg-emerald-500"
            aria-label="Send"
            onClick={() => {
              if (mode === "ussd") void sendUssdSelection();
              else void sendSms();
            }}
          >
            {loading ? <Loader2 className="size-6 animate-spin text-white" /> : null}
          </button>
          <button
            type="button"
            className="rounded-lg bg-slate-700 px-3 py-2 text-[10px] font-bold uppercase text-slate-200"
            onClick={() => {
              if (mode === "ussd") void sendUssdFreeText();
              else setSmsDraft("");
            }}
          >
            {mode === "ussd" ? "Text+" : "Clear"}
          </button>
        </div>
      </div>

      {mode === "ussd" ? (
        <p className="max-w-sm text-center text-xs text-muted-foreground">
          Demo shortcode <span className="font-mono font-bold">*384*253#</span>. Use keys for menus;
          at “describe emergency”, type text with the keypad then tap <strong>Text+</strong>, or use
          multi-tap and <strong>Send</strong> (green).
        </p>
      ) : (
        <p className="max-w-sm text-center text-xs text-muted-foreground">
          Try <span className="font-mono">HELP</span> or{" "}
          <span className="font-mono">REPORT|flooding|Kondele|…</span> then green send.
        </p>
      )}
    </div>
  );
}
