"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Parisienne } from 'next/font/google';
interface SequenceProps {
  images: string[];
  accent?: string;
}
const parisienne = Parisienne({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function WeddingGallerySequence({ images, accent = "#e1ff00" }: SequenceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });


  // Smooth out the scroll progress - higher stiffness = faster response, higher damping = less oscillation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.0001,
    mass: 0.5
  });

  const scheduleX = useTransform(smoothProgress, [0.25, 0.35, 0.75, 0.85], [-100, 40, 40, -100]);
  const scheduleOpacity = useTransform(smoothProgress, [0.25, 0.35, 0.75, 0.85], [0, 1, 1, 0]);

  // Individual point highlight logic (mapping scroll to active index)
  const activeIndex = useTransform(smoothProgress, [0.35, 0.5, 0.65, 0.75], [0, 1, 2, 3]);
  const scale1 = useTransform(smoothProgress, [0, 0.4], [1, 1.5]);
  const blur1 = useTransform(smoothProgress, [0.2, 0.4], ["blur(0px)", "blur(20px)"]);
  const opacity1 = useTransform(smoothProgress, [0.3, 0.4], [1, 0]);

  // 2. Image 2 - Reveal with "Growth" Scale
  // Starts small (0.8) and grows to 1.1 as it fills up
  const scale2 = useTransform(smoothProgress, [0.2, 0.5, 0.7], [0.8, 1, 1.2]);
  const clip2 = useTransform(smoothProgress, [0.25, 0.55], [
    "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", // Bottom start
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"      // Full cover
  ]);
  const blur2 = useTransform(smoothProgress, [0.2, 0.3, 0.5, 0.6], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);

  // 3. Image 3 - Horizontal "Aperture" Reveal
  const scale3 = useTransform(smoothProgress, [0.5, 0.8, 1], [1.3, 1, 0.9]);
  const clip3 = useTransform(smoothProgress, [0.55, 0.85], [
    "inset(0% 50% 0% 50%)", // Starts from center line
    "inset(0% 0% 0% 0%)"    // Expands outward
  ]);
  const scheduleItems = [
    { time: "03:00 (LT)", title: "Arriving At The Grooms's House", location: "አያት ዞን 1" },
    { time: "04:00 (LT)", title: "Arriving At The Bride's House", location: "አያት ዞን 3" },
    { time: "05:00 (LT)", title: "Going To The Venue", location: "ጉዞ ወደ አዳራሽ" },
    { time: "06:30 (LT)", title: "Lunch Program", location: "East West | Gofa Mebrat" },
  ];
  // 4. Image 4 - Final Depth focus
  const scale4 = useTransform(smoothProgress, [0.8, 1], [1.8, 1]);
  const opacity4 = useTransform(smoothProgress, [0.8, 0.9], [0, 1]);

  return (
    <div ref={scrollRef} className="relative h-[500vh] w-full" style={{ backgroundColor: accent }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Layer 1: The Foundation */}
        <motion.div
          style={{
            scale: scale1,
            filter: blur1,
            opacity: opacity1,
            backgroundImage: `url(${images[0]})`
          }}
          className="absolute inset-0 bg-cover bg-center will-change-[transform,filter,opacity] transform-gpu"
        />

{/* Layer 2: Rising Veil */}
        <motion.div
          style={{
            clipPath: clip2,
            scale: scale2,
            filter: blur2,
            backgroundImage: `url(${images[1]})`,
            zIndex: 10
          }}
          className="absolute inset-0 bg-cover bg-center will-change-[clip-path,transform] transform-gpu"
        />

{/* Layer 3: Expanding Aperture */}
        <motion.div
          style={{
            clipPath: clip3,
            scale: scale3,
            backgroundImage: `url(${images[2]})`,
            zIndex: 20
          }}
          className="absolute inset-0 bg-cover bg-center will-change-[clip-path,transform] transform-gpu"
        />

{/* Layer 4: Rushing Focus */}
        <motion.div
          style={{
            scale: scale4,
            opacity: opacity4,
            backgroundImage: `url(${images[3]})`,
            zIndex: 30
          }}
          className="absolute inset-0 bg-cover bg-center will-change-transform transform-gpu"
        />
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
        `
              }}
            >
              Schedule
            </h2>
            <div
              className="h-[2px] w-12 mt-2"
              style={{
                background: `linear-gradient(90deg, #fff, transparent)`,
                boxShadow: `0 0 10px #fff`
              }}
            />
          </div>

          <div className="flex flex-col gap-10 border-l border-white/30 pl-8 py-4"></div>
          {scheduleItems.map((item, index) => {
            // This hook handles the individual "glow" or movement of the active item
            return (
              <ScheduleItem
                key={index}
                item={item}
                index={index}
                smoothProgress={smoothProgress}
                accent={accent}
              />
            );
          })}
        </motion.div>
        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

        {/* Interactive Floating Text */}
        <motion.div
          style={{
            y: useTransform(smoothProgress, [0, 1], [100, -100]),
            opacity: useTransform(smoothProgress, [0.45, 0.55, 0.9], [0, 1, 0])
          }}
          className="absolute inset-0 z-50 flex items-center justify-center"
        >
          {/* <h2 className="text-white text-6xl md:text-8xl font-black italic tracking-tighter opacity-20 select-none">
            ETERNAL
          </h2> */}
        </motion.div>
      </div>
    </div>
  );
}
function ScheduleItem({ item, index, smoothProgress, accent }: any) {
  // Each item activates at a specific scroll chunk
  const start = 0.35 + (index * 0.12);
  const end = start + 0.12;

  const itemOpacity = useTransform(smoothProgress, [start - 0.05, start, end, end + 0.05], [0.3, 1, 1, 0.3]);
  const itemScale = useTransform(smoothProgress, [start, start + 0.05], [0.9, 1]);
  const dotColor = useTransform(smoothProgress, [start, start + 0.05], ["#ffffff", accent]);

return (
    <motion.div style={{ opacity: itemOpacity, scale: itemScale }} className="relative group transform-gpu will-change-[transform,opacity]">
      {/* The Pinpoint Dot */}
      <motion.div
        style={{ backgroundColor: dotColor }}
        className="absolute -left-[41px] top-2 h-4 w-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
      />

<motion.div
        style={{ opacity: itemOpacity, scale: itemScale }}
        className="relative group drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transform-gpu"
      >
        {/* The Pinpoint Dot with enhanced glow */}
        <motion.div
          style={{ backgroundColor: dotColor }}
          className="absolute -left-[41px] top-2 h-4 w-4 rounded-full border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.8),0_0_10px_rgba(255,255,255,0.4)]"
        />

        <div className="flex flex-col text-left">
          {/* TIME - Subtle glow */}
          <span
            className="text-[10px] uppercase tracking-[0.2em] text-white mb-1"
            style={{
              textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)'
            }}
          >
            {item.time}
          </span>

          {/* TITLE - Intense, multi-layered glow */}
          <h3
            className="text-white text-lg font-bold leading-tight max-w-[200px]"
            style={{
              textShadow: `
          0 0 7px rgba(255,255,255,0.9),
          0 0 15px rgba(255,255,255,0.5),
          0 0 25px rgba(255,255,255,0.2)
        `
            }}
          >
            {item.title}
          </h3>

          {/* LOCATION - Soft ethiopic glow */}
          <p
            className="text-white/90 text-xs mt-1 font-light italic"
            style={{
              fontFamily: 'Noto Serif Ethiopic',
              textShadow: '0 0 8px rgba(255,255,255,0.6)'
            }}
          >
            {item.location}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
