"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type LowBandwidthContextValue = {
  lowBandwidth: boolean;
  setLowBandwidth: (value: boolean) => void;
  toggle: () => void;
};

const LowBandwidthContext = createContext<LowBandwidthContextValue | null>(
  null,
);

const STORAGE_KEY = "elma-low-bandwidth";

export function LowBandwidthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lowBandwidth, setLowBandwidthState] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "1") setLowBandwidthState(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("elma-lite", lowBandwidth);
    localStorage.setItem(STORAGE_KEY, lowBandwidth ? "1" : "0");
  }, [lowBandwidth]);

  const setLowBandwidth = useCallback((value: boolean) => {
    setLowBandwidthState(value);
  }, []);

  const toggle = useCallback(() => {
    setLowBandwidthState((v) => !v);
  }, []);

  const value = useMemo(
    () => ({ lowBandwidth, setLowBandwidth, toggle }),
    [lowBandwidth, setLowBandwidth, toggle],
  );

  return (
    <LowBandwidthContext.Provider value={value}>
      {children}
    </LowBandwidthContext.Provider>
  );
}

export function useLowBandwidth() {
  const ctx = useContext(LowBandwidthContext);
  if (!ctx) {
    throw new Error("useLowBandwidth must be used within LowBandwidthProvider");
  }
  return ctx;
}
