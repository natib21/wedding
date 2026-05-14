"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { TemplateProps } from "../type/wedding";
import { Noto_Serif_Ethiopic } from "next/font/google";
import EthiopianCalendar from "../sections/EthiopianCalendar";
import {
  TEMPLATE_THREE_ARCHIVE_IMAGE,
  TEMPLATE_THREE_GALLERY_SEQUENCE_IMAGES,
  TEMPLATE_THREE_HERO_IMAGES,
} from "@/lib/weddingImageUrls";
import { BLUR_DATA_URL } from "@/lib/imagePlaceholder";
import QRCode from "react-qr-code";
import { Parisienne } from "next/font/google";

const WeddingGallerySequence = dynamic(() => import("../sections/WeddingGallerySequence"), {
  ssr: true,
  loading: () => (
    <div
      className="relative h-[min(60vh,520px)] w-full bg-neutral-950"
      aria-hidden
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-neutral-900 to-black" />
    </div>
  ),
});

const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const notoSerif = Noto_Serif_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["300", "400", "700"],
});

const heroImages = [...TEMPLATE_THREE_HERO_IMAGES];
const galleryImages = [...TEMPLATE_THREE_GALLERY_SEQUENCE_IMAGES];
const ARCHIVE_IMAGE = TEMPLATE_THREE_ARCHIVE_IMAGE;

export default function TemplateThree({ data }: TemplateProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.8, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const { scrollY } = useScroll();
  const fadeOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textY = useTransform(scrollY, [0, 400], [0, -100]);

  const accent = "#e1ff00";

  return (
    <div className=" text-slate-100  min-h-screen">
      <header className={`relative h-screen bg-gray-950 overflow-hidden -z-10 ${notoSerif.className}`}>
        <AnimatePresence mode="sync">
          <motion.div
            key={currentImage}
            className="fixed inset-0 z-0 h-screen w-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <div className="absolute inset-0">
              <Image
                src={heroImages[currentImage]}
                alt=""
                fill
                priority={currentImage === 0}
                fetchPriority={currentImage === 0 ? "high" : "low"}
                className="object-cover opacity-80"
                sizes="100vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                draggable={false}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="fixed inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />

        <section className="h-full flex flex-col justify-end pb-12 relative z-30 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-16 left-0 right-0 flex flex-col items-center gap-1"
          >
            <span
              className={`${parisienne.className} text-8xl md:text-5xl font-extralight`}
              style={{ color: accent }}
            >
              Wedding
            </span>
            <span className={`${notoSerif.className} text-4xl md:text-5xl mb-2`} style={{ color: accent }}>
              ሠርግ
            </span>

            <span className={` tracking-[0.8em] uppercase font-extralight text-white/60`}>Invitation</span>
          </motion.div>

          <motion.div style={{ opacity: fadeOpacity, y: textY }} className="space-y-8 ">
            <motion.h1
              key={`name-${currentImage}`}
              className="text-3xl md:text-5xl font-light tracking-[0.2em] text-white leading-tight"
              initial={{ opacity: 0.85, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {data.names}
            </motion.h1>

            <motion.div
              className="max-w-xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <div className="h-px w-8 bg-white/20 mx-auto mb-6" />

              <div className="space-y-4 px-4 text-center">
                <p
                  className="text-white/80 font-light leading-[1.8] text-sm md:text-base tracking-wide"
                  style={{ fontFamily: "'Noto Serif Ethiopic', serif" }}
                >
                  &ldquo;ሙሽራይቱ ያለችው እርሱ ሙሽራ ነው፤ ቆሞ የሚሰማው ሚዜው ግን በሙሽራው ድምጽ እጅግ ደስ ይለዋል። እንግዲህ ይህ ደስታዬ ተፈጸመ።&rdquo;
                </p>

                <p className="text-white/60 font-extralight leading-relaxed text-[11px] md:text-xs tracking-widest italic uppercase">
                  &ldquo;He that hath the bride is the bridegroom: but the friend of the bridegroom, which standeth
                  and heareth him, rejoiceth greatly because of the bridegroom&apos;s voice: this my joy therefore is
                  fulfilled.&rdquo;
                </p>

                <p className="text-[10px] tracking-[0.4em] text-white/40 font-bold uppercase pt-2">John 3:29</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center text-[9px] tracking-[0.4em] text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          />
        </section>
      </header>

      <section className="m-4 flex justify-center z-50" style={{ backgroundColor: accent }}>
        <div className="relative w-full h-50 md:h-175 overflow-hidden min-h-[200px] md:min-h-[28rem]">
          <Image
            src={ARCHIVE_IMAGE}
            alt="Archive"
            fill
            className="object-cover duration-700 hover:scale-110 pt-5 px-10 pb-15"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            draggable={false}
          />

          <div className="absolute bottom-0 left-4 right-0 p-6 ">
            <p className="text-sm text-black font-extralight leading-relaxed italic">Photo Album</p>
          </div>

          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10" />
        </div>
      </section>

      <div ref={containerRef} className="relative h-[200vh] z-40">
        <main className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <motion.div
            style={{
              scale,
              opacity,
            }}
            className="flex flex-col items-center w-full px-4 will-change-transform"
          >
            <div className="relative w-full max-w-2xl px-6 py-12 bg-white shadow-2xl rounded-lg text-center">
              <div className="mb-5">
                <h2 className={`${parisienne.className} text-5xl md:text-6xl text-slate-900 `}>
                  Henok berhane & Tsion g/tensae
                </h2>
                <p
                  className="text-lg md:text-xl font-light text-slate-800"
                  style={{ fontFamily: "Noto Serif Ethiopic" }}
                >
                  ሄኖክ ብርሀኔ & ፅዮን ገ/ትንሳኤ
                </p>
              </div>

              <div className="max-w-lg mx-auto">
                <p
                  className="text-base md:text-lg font-medium text-slate-900 leading-relaxed"
                  style={{ fontFamily: "Noto Serif Ethiopic" }}
                >
                  ውድ ቤተሰቦቻችን እና ጓደኞቻችን
                </p>

                <p
                  className="text-sm md:text-base font-light text-slate-700 leading-[2]"
                  style={{ fontFamily: "Noto Serif Ethiopic" }}
                >
                  እነሆ ልዑል እግዚአብሔር ፈቅዶ የጋብቻችንን ሥነ-ሥርዓት ለመፈጸም ተቃርበናል። በመሆኑም ከታች በተጠቀሰው ጊዜና ቦታ ተገኝታችሁ የደስታችን ተካፋይ እንዲሆኑ ስንጋብዝዎት በታላቅ ደስታ ነው።
                </p>

                <p
                  className="text-sm md:text-base font-light text-slate-700 leading-[2] italic"
                  style={{ fontFamily: "Noto Serif Ethiopic" }}
                >
                  የማይደገም እና የማይረሳ ቀናችንን ከእኛ ጋር ቢያሳልፉ ደስታችን እጥፍ ድርብ ነው።
                </p>
              </div>

              <div className="mt-5 space-y-4">
                <div className="space-y-1">
                  <p
                    className="text-sm tracking-[0.2em] text-slate-600 font-semibold uppercase"
                    style={{ fontFamily: "Noto Serif Ethiopic" }}
                  >
                    ግንቦት ፳፫ ቀን ፪፲፻፲፰ ዓ.ም
                  </p>
                  <p className="text-xs text-stone-500 tracking-[0.3em] uppercase">Saternday, May 30, 2026</p>
                </div>
                <p className="text-xs text-stone-400 tracking-wider">Addis Ababa, Ethiopia</p>
              </div>
            </div>
          </motion.div>
        </main>

        <WeddingGallerySequence images={galleryImages} accent={accent} />

        <EthiopianCalendar />

        <section className="relative z-50 bg-black py-20 px-6">
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

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mb-16"
            >
              <div className="inline-block p-6 bg-white rounded-lg shadow-2xl">
                <QRCode
                  value={data.rsvpLink || "https://wedding-invitation.com/rsvp"}
                  size={250}
                  level="H"
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
              <p className="mt-4 text-xs tracking-[0.3em] uppercase text-white/40">Scan to RSVP</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-8 border-t border-white/10"
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
                <span style={{ color: accent }} className="text-2xl">
                  &#10084;
                </span>
                <div className="h-px w-12 bg-white/20" />
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
