"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { Playfair_Display, Lora, Noto_Serif_Ethiopic } from "next/font/google";
import { TemplateProps } from "@/components/type/wedding";
import QRCode from "react-qr-code";
import { Parisienne } from "next/font/google";
import EthiopianCalendar from "../sections/EthiopianCalendar";
import { TEMPLATE_TWO_HERO_IMAGE } from "@/lib/weddingImageUrls";
import { BLUR_DATA_URL } from "@/lib/imagePlaceholder";

const TemplateTwoGallery = dynamic(() => import("../sections/TemplateTwoGallery"), {
  ssr: true,
  loading: () => (
    <div className="py-20 bg-black relative overflow-hidden" aria-hidden>
      <div className="max-w-7xl mx-auto px-6 mb-12 h-16 w-64 rounded bg-white/5 animate-pulse" />
      <div className="h-[620px] mx-6 rounded-lg bg-white/5 animate-pulse" />
    </div>
  ),
});

const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"] });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] });
const notoSerif = Noto_Serif_Ethiopic({ subsets: ["ethiopic"], weight: ["300", "400", "700"] });

const ARCHIVE_IMAGE = TEMPLATE_TWO_HERO_IMAGE;

export default function TemplateTwo({ data }: TemplateProps) {
  const [gatekeeperMode, setGatekeeperMode] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const qrUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/invitation/${data.slug}`;

  return (
    <div className={`bg-[#0a0806] text-stone-200 overflow-x-hidden ${lora.className}`}>
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          type="button"
          onClick={() => setGatekeeperMode(!gatekeeperMode)}
          className="bg-white/5 backdrop-blur-xl border border-amber-500/20 hover:border-amber-500 px-5 py-2.5 rounded-full text-xs uppercase tracking-widest text-amber-500/70 hover:text-amber-400 transition-all"
        >
          {gatekeeperMode ? "ADMIN MODE ENABLED" : "GATEKEEPER"}
        </button>
      </div>

      <header className="relative h-screen min-h-[100dvh] flex flex-col items-center overflow-hidden bg-neutral-950">
        <Image
          src={ARCHIVE_IMAGE}
          alt="Wedding"
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />

        <div className="absolute bottom-24 z-10 text-center px-6 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`text-5xl md:text-6xl leading-none mb-6 ${playfair.className} text-white font-light`}
          >
            {data.names}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="inline-flex items-center gap-4 text-amber-300/60"
          >
            <div className="h-px w-8 bg-amber-500/30" />
            <p className={`text-xl italic ${playfair.className}`}>
              {new Date(data.weddingDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <div className="h-px w-8 bg-amber-500/30" />
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-[10px] tracking-[0.5em] uppercase">
          Scroll
        </div>
      </header>

      <section className="py-32  bg-[#0f0d0b]">
        <div className="max-w-3xl mx-auto bg-[#1a1714] border border-amber-500/10 p-5 shadow-2xl">
          <div className="text-center mb-16">
            <span className="text-amber-500 text-6xl">❦</span>
          </div>

          <p className={`text-3xl leading-relaxed text-center text-stone-100 ${notoSerif.className}`}>
            ውድ ቤተሰቦቻችንና ጓደኞቻችን፣
          </p>

          <p className={`mt-12 text-lg leading-relaxed text-stone-300 text-center ${notoSerif.className}`}>
            በእግዚአብሔር ፈቃድ የጋብቻ ሥነ ሥርዓታችንን ለማክበር ተዘጋጅተናል። በዚህ ደስታችን ውስጥ ተገኝተው የበረከት ተካፋይ እንዲሆኑ በታላቅ ክብር እንጋብዛለን።
          </p>

          <div className="mt-16 pt-10 border-t border-amber-500/10 text-center">
            <p className={`text-2xl ${playfair.className} text-amber-100`}>Henok Berhane & Tsion G/Tensae</p>
          </div>
        </div>
      </section>

      <EthiopianCalendar />

      <TemplateTwoGallery />

      <section className="py-32 px-6 bg-[#0a0806] flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center" />
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-3">Dear Guest</p>
            <h3 className={`${parisienne.className} text-4xl md:text-5xl text-white`}>
              {data.guestName || "Honored Guest"}
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16 space-y-6"
          >
            <div className="h-px w-16 bg-white/20 mx-auto" />

            <h4
              className="text-2xl md:text-3xl font-light text-white"
              style={{ fontFamily: "'Noto Serif Ethiopic', serif" }}
            >
              እናመሰግናለን
            </h4>
            <p className="text-sm tracking-[0.3em] uppercase text-white/60">Thank You</p>

            <p
              className="text-base md:text-lg font-light text-white/80 leading-[2] max-w-lg mx-auto"
              style={{ fontFamily: "'Noto Serif Ethiopic', serif" }}
            >
              ለልዩ ቀናችን አብረውን ለመሆን ስለተስማሙ ከልብ እናመሰግናለን። የእርስዎ ፍቅር እና ድጋፍ ለእኛ ትልቅ ትርጉም አለው።
            </p>

            <p className="text-sm font-light text-white/60 leading-relaxed max-w-md mx-auto italic">
              Thank you for agreeing to be part of our special day. Your love and support mean everything to us.
            </p>
          </motion.div>

          <div className="bg-[#1a1714] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-amber-500/30" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-amber-500/30" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-amber-500/30" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-amber-500/30" />

            <div className="mb-8">
              <p className={`text-3xl text-amber-100 ${parisienne.className}`}>{data.guestName || "Dear Guest"}</p>
              <div className="h-px w-12 bg-amber-500/20 mx-auto mt-4" />
            </div>

            <div className="bg-white p-6 rounded-2xl inline-block shadow-inner">
              {mounted ? (
                <QRCode value={qrUrl} size={220} bgColor="#ffffff" fgColor="#1a1714" level="H" />
              ) : (
                <div className="w-[220px] h-[220px] bg-gray-100 animate-pulse rounded-lg" />
              )}
            </div>

            <div className="mt-8 text-stone-400">
              <p className="text-xs uppercase tracking-widest leading-relaxed">
                Scan at the entrance to <br />
                confirm your attendance
              </p>
            </div>
          </div>

          {gatekeeperMode && data.status === "pending" && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              disabled={isCheckingIn}
              className="mt-12 w-full bg-amber-500 hover:bg-amber-600 text-black py-5 rounded-2xl font-bold tracking-[0.2em] text-xs uppercase transition-all shadow-lg shadow-amber-500/20"
            >
              {isCheckingIn ? "VERIFYING..." : "✓ VERIFY ENTRANCE"}
            </motion.button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="pt-8 border-t border-white/10 max-w-2xl mx-auto text-center"
        >
          <p
            className="text-lg md:text-xl font-light text-white/90 leading-[2] mb-4"
            style={{ fontFamily: "'Noto Serif Ethiopic', serif" }}
          >
            መገኘትዎ ለደስታችን ትልቅ ትርጉም አለው።
          </p>
          <p className="text-sm font-light text-white/60 italic max-w-md mx-auto">
            &quot;Your presence means the world to us as we begin this new chapter together.&quot;
          </p>

          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-white/20" />
            <span className="text-2xl">&#10084;</span>
            <div className="h-px w-12 bg-white/20" />
          </div>
        </motion.div>
      </section>

      <footer className="py-24 text-center border-t border-white/5">
        <p className={`text-3xl italic ${playfair.className}`}>With Love & Gratitude</p>
        <p className="mt-6 text-stone-500 text-sm tracking-widest">ADDIS ABABA • ETHIOPIA • 2026</p>
      </footer>
    </div>
  );
}
