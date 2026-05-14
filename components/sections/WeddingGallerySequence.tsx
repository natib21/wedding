"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { BLUR_DATA_URL } from "@/lib/imagePlaceholder";

interface SequenceProps {
  images: string[];
  accent?: string;
}

function padImages(images: string[], count: number): string[] {
  const fallback = "/images/gallery/1H7A0094.JPG";
  if (images.length === 0) return Array.from({ length: count }, () => fallback);
  const out = [...images];
  while (out.length < count) {
    out.push(out[out.length - 1] ?? fallback);
  }
  return out.slice(0, count);
}

export default function WeddingGallerySequence({ images, accent = "#e1ff00" }: SequenceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const layers = useMemo(() => padImages(images, 4), [images]);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const progress = scrollYProgress;

  const scheduleX = useTransform(progress, [0.25, 0.35, 0.75, 0.85], [-100, 40, 40, -100]);
  const scheduleOpacity = useTransform(progress, [0.25, 0.35, 0.75, 0.85], [0, 1, 1, 0]);

  const scale1 = useTransform(progress, [0, 0.4], [1, 1.5]);
  const opacity1 = useTransform(progress, [0.3, 0.4], [1, 0]);

  const scale2 = useTransform(progress, [0.2, 0.5, 0.7], [0.8, 1, 1.2]);
  const clip2 = useTransform(progress, [0.25, 0.55], [
    "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  ]);

  const scale3 = useTransform(progress, [0.5, 0.8, 1], [1.3, 1, 0.9]);
  const clip3 = useTransform(progress, [0.55, 0.85], ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"]);

  const scale4 = useTransform(progress, [0.8, 1], [1.8, 1]);
  const opacity4 = useTransform(progress, [0.8, 0.9], [0, 1]);

  const floatingY = useTransform(progress, [0, 1], [100, -100]);
  const floatingOpacity = useTransform(progress, [0.45, 0.55, 0.9], [0, 1, 0]);

  const scheduleItems = [
    { time: "03:00 (LT)", title: "Arriving At The Grooms's House", location: "አያት ዞን 1" },
    { time: "04:00 (LT)", title: "Arriving At The Bride's House", location: "አያት ዞን 3" },
    { time: "05:00 (LT)", title: "Going To The Venue", location: "ጉዞ ወደ አዳራሽ" },
    { time: "06:30 (LT)", title: "Lunch Program", location: "East West | Gofa Mebrat" },
  ];

  return (
    <div ref={scrollRef} className="relative h-[500vh] w-full" style={{ backgroundColor: accent }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          style={{
            scale: scale1,
            opacity: opacity1,
          }}
          className="absolute inset-0 overflow-hidden transform-gpu will-change-[transform,opacity]"
        >
          <Image
            src={layers[0]}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            draggable={false}
          />
        </motion.div>

        <motion.div
          style={{
            clipPath: clip2,
            scale: scale2,
            zIndex: 10,
          }}
          className="absolute inset-0 overflow-hidden transform-gpu will-change-[clip-path,transform]"
        >
          <Image
            src={layers[1]}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            draggable={false}
          />
        </motion.div>

        <motion.div
          style={{
            clipPath: clip3,
            scale: scale3,
            zIndex: 20,
          }}
          className="absolute inset-0 overflow-hidden transform-gpu will-change-[clip-path,transform]"
        >
          <Image
            src={layers[2]}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            draggable={false}
          />
        </motion.div>

        <motion.div
          style={{
            scale: scale4,
            opacity: opacity4,
            zIndex: 30,
          }}
          className="absolute inset-0 overflow-hidden transform-gpu will-change-[transform,opacity]"
        >
          <Image
            src={layers[3]}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            draggable={false}
          />
        </motion.div>

        <motion.div
          style={{ x: scheduleX, opacity: scheduleOpacity }}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-10 border-l border-white/30 pl-8 py-10 transform-gpu will-change-transform"
        >
          <div className="mb-8 ml-[-8px]">
            <h2
              className=" text-white text-4xl font-black italic tracking-widest uppercase font-font-family-1"
              style={{
                textShadow: `
          0 0 10px rgba(255,255,255,0.8),
          0 0 20px rgba(255,255,255,0.4),
          0 0 40px ${accent}66
        `,
              }}
            >
              Schedule
            </h2>
            <div
              className="h-[2px] w-12 mt-2"
              style={{
                background: `linear-gradient(90deg, #fff, transparent)`,
                boxShadow: `0 0 10px #fff`,
              }}
            />
          </div>

          <div className="flex flex-col gap-10 border-l border-white/30 pl-8 py-4" />
          {scheduleItems.map((item, index) => (
            <ScheduleItem key={index} item={item} index={index} progress={progress} accent={accent} />
          ))}
        </motion.div>

        <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

        <motion.div
          style={{
            y: floatingY,
            opacity: floatingOpacity,
          }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        />
      </div>
    </div>
  );
}

interface ScheduleItemProps {
  item: { time: string; title: string; location: string };
  index: number;
  progress: MotionValue<number>;
  accent: string;
}

function ScheduleItem({ item, index, progress, accent }: ScheduleItemProps) {
  const start = 0.35 + index * 0.12;
  const end = start + 0.12;

  const itemOpacity = useTransform(progress, [start - 0.05, start, end, end + 0.05], [0.3, 1, 1, 0.3]);
  const itemScale = useTransform(progress, [start, start + 0.05], [0.9, 1]);
  const dotColor = useTransform(progress, [start, start + 0.05], ["#ffffff", accent]);

  return (
    <motion.div
      style={{ opacity: itemOpacity, scale: itemScale }}
      className="relative group transform-gpu will-change-[transform,opacity] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
    >
      <motion.div
        style={{ backgroundColor: dotColor }}
        className="absolute -left-[41px] top-2 h-4 w-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
      />

      <div className="flex flex-col text-left">
        <span
          className="text-[10px] uppercase tracking-[0.2em] text-white mb-1"
          style={{
            textShadow: "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)",
          }}
        >
          {item.time}
        </span>

        <h3
          className="text-white text-lg font-bold leading-tight max-w-[200px]"
          style={{
            textShadow: `
          0 0 7px rgba(255,255,255,0.9),
          0 0 15px rgba(255,255,255,0.5),
          0 0 25px rgba(255,255,255,0.2)
        `,
          }}
        >
          {item.title}
        </h3>

        <p
          className="text-white/90 text-xs mt-1 font-light italic"
          style={{
            fontFamily: "Noto Serif Ethiopic",
            textShadow: "0 0 8px rgba(255,255,255,0.6)",
          }}
        >
          {item.location}
        </p>
      </div>
    </motion.div>
  );
}
