"use client";

import { useEffect, useState } from "react";
import { preloadImages } from "@/lib/preloadImages";

type CriticalImageBootProps = {
  urls: readonly string[];
  children: React.ReactNode;
  /** Do not block longer than this (ms) in poor network conditions. */
  maxWaitMs?: number;
};

export default function CriticalImageBoot({
  urls,
  children,
  maxWaitMs = 18_000,
}: CriticalImageBootProps) {
  const [ready, setReady] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setShowContent(false);

    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, maxWaitMs);

    preloadImages(urls).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [urls, maxWaitMs]);

  useEffect(() => {
    if (!ready) return;
    const id = window.requestAnimationFrame(() => setShowContent(true));
    return () => window.cancelAnimationFrame(id);
  }, [ready]);

  return (
    <div className="relative min-h-screen">
      {!showContent && (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-[#0a0a0a] text-white"
          aria-busy="true"
          aria-label="Loading wedding invitation"
        >
          <div className="h-0.5 w-40 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-white/30 animate-pulse" />
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-16 w-12 rounded-sm bg-white/5 ring-1 ring-white/10 animate-pulse"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/35">Loading moments</p>
        </div>
      )}

      <div
        className={`transition-opacity duration-700 ease-out ${
          showContent ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
