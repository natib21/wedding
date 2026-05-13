"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { TemplateProps } from "../type/wedding";
import { Noto_Serif_Ethiopic } from 'next/font/google';
import { useScroll, useTransform } from 'framer-motion';
import WeddingGallerySequence from '../sections/WeddingGallerySequence';
import EthiopianCalendar from '../sections/EthiopianCalendar';
const images = [
  "/images/gallery/1H7A0094.JPG",
  "/images/gallery/1H7A0051.JPG",
  // "/images/gallery/1H7A9963.JPG",
  "/images/gallery/1H7A0460.JPG"
];
const galleryImages = [
  // "/images/gallery/1H7A0094.JPG",
  // "/images/gallery/1H7A0051.JPG",
  "/images/gallery/1H7A0460.JPG",
  // "/images/gallery/1H7A0007.JPG",
  "images/gallery/1H7A0334.JPG",
  "/images/gallery/1H7A0094.JPG",   // you can replace with new images
  "/images/gallery/1H7A0051.JPG",
];
import QRCode from 'react-qr-code';
import { Parisienne } from 'next/font/google';
const parisienne = Parisienne({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});
const ARCHIVE_IMAGE = "/images/gallery/1H7A0007.JPG";
const notoSerif = Noto_Serif_Ethiopic({
  subsets: ['ethiopic'],
  weight: ['300', '400', '700']
});
export default function TemplateThree({ data }: TemplateProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Create smooth scale and opacity transforms
  // It // 1. Scale goes all the way to 0
  const scale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.8, 0]);

  // 2. Opacity fades out completely
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);

  // 3. Optional: Increase the blur to make the "disappearing" look softer
  const blur = useTransform(scrollYProgress, [0.4, 1], ["blur(0px)", "blur(20px)"]);

  // 4. Increase stiffness for a more "snappy" feeling as it disappears
  const smoothScale = useSpring(scale, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  const { scrollY } = useScroll();

  // As scroll moves from 0 to 300px, opacity goes from 1 to 0
  const fadeOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  // Also slightly move the text up as it fades for a smoother effect
  const textY = useTransform(scrollY, [0, 400], [0, -100]);

  const accent = "#e1ff00";   // Main color

  return (
    <div className=" text-slate-100  min-h-screen">
      <header className={`relative h-screen bg-gray overflow-hidden -z-10 ${notoSerif.className}`}>

        {/* 1. FIXED BACKGROUND LAYER (Stays in place during scroll) */}
          <AnimatePresence >
          <motion.div
            key={currentImage}
            className="fixed inset-0 z-0 h-screen w-screen"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            {/* The Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
              style={{ backgroundImage: `url(${images[currentImage]})` }}
            />

            {/* The White "Camera Flash" Overlay */}
            <motion.div
              className="absolute inset-0 bg-white z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 0.5,
                times: [0, 0.5, 1],
                ease: "easeInOut"
              }}
            />
          </motion.div>
          </AnimatePresence>

        {/* 2. FIXED GRADIENT OVERLAY (Darkens the bottom for text readability) */}
          <div className="fixed inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />

        {/* 3. SCROLLABLE CONTENT LAYER */}
          <section className="h-full flex flex-col justify-end pb-12 relative z-30 text-center px-6 max-w-4xl mx-auto">

          {/* Top Label: Floating at the very top */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-16 left-0 right-0 flex flex-col items-center gap-1"
          >
            {/* The Main Wedding Label */}
            <span
              className={`${parisienne.className} text-8xl md:text-5xl font-extralight`}
              style={{ color: accent }}
            >
              Wedding
            </span>
            <span
              className={`${notoSerif.className} text-4xl md:text-5xl mb-2`}
              style={{ color: accent }}
            >
              ሠርግ
            </span>

            {/* The Sub-label */}
            <span className={` tracking-[0.8em] uppercase font-extralight text-white/60`}>
              Invitation
            </span>
          </motion.div>

          {/* Bottom-Aligned Content Group */}
          <motion.div
            style={{ opacity: fadeOpacity, y: textY }}
            className="space-y-8 "
          >
            {/* Main Names */}
            <motion.h1
              key={`name-${currentImage}`}
              className="text-3xl md:text-5xl font-light tracking-[0.2em] text-white leading-tight"
              initial={{ opacity: 1, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {data.names}
            </motion.h1>

            {/* Invitation Paragraph */}
            <motion.div
              className="max-w-xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.2 }}
            >
              <div className="h-px w-8 bg-white/20 mx-auto mb-6" />

              <div className="space-y-4 px-4 text-center">
                {/* Amharic Verse - Using Noto Serif Ethiopic */}
                <p
                  className="text-white/80 font-light leading-[1.8] text-sm md:text-base tracking-wide"
                  style={{ fontFamily: "'Noto Serif Ethiopic', serif" }}
                >
                  &ldquo;ሙሽራይቱ ያለችው እርሱ ሙሽራ ነው፤ ቆሞ የሚሰማው ሚዜው ግን በሙሽራው ድምጽ እጅግ ደስ ይለዋል። እንግዲህ ይህ ደስታዬ ተፈጸመ።&rdquo;
                </p>

                {/* English Verse - Matching the theme */}
                <p className="text-white/60 font-extralight leading-relaxed text-[11px] md:text-xs tracking-widest italic uppercase">
                  &ldquo;He that hath the bride is the bridegroom: but the friend of the bridegroom,
                  which standeth and heareth him, rejoiceth greatly because of the bridegroom&apos;s
                  voice: this my joy therefore is fulfilled.&rdquo;
                </p>

                <p className="text-[10px] tracking-[0.4em] text-white/40 font-bold uppercase pt-2">
                  John 3:29
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Animated Scroll Indicator */}
          <motion.div
            className="flex flex-col items-center text-[9px] tracking-[0.4em] text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
          </motion.div>
          </section>

      </header>


    
<section className="m-4 flex justify-center z-50" style={{ backgroundColor: accent }}>
  <div className="relative w-full h-50 md:h-175 overflow-hidden"> 
    
    {/* 2. Use the 'fill' prop instead of fixed width/height */}
    <Image
      src={ARCHIVE_IMAGE}
      alt="Archive"
      fill // This makes it take up 100% of the nearest relative parent
      className="object-cover duration-700 hover:scale-110 pt-5 px-10 pb-15"
      sizes="100vw"
      priority
    />

    {/* 3. Overlay Content (Absolute positioned to stay on top of the 'fill' image) */}
    <div className="absolute bottom-0 left-4 right-0 p-6 ">
      <p className="text-sm text-black font-extralight leading-relaxed italic">
        Photo Album
      </p>
    </div>

    {/* Subtle Inner Glow */}
    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10" />
  </div>
</section>

      <div ref={containerRef} className="relative h-[200vh] z-40">

         <main className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

          <motion.div
            style={{
              scale: smoothScale,
              opacity,
              filter: blur
            }}
            className="flex flex-col items-center w-full px-4"
          >
            <div className="relative w-full max-w-2xl px-6 py-12 bg-white shadow-2xl rounded-lg text-center">

              {/* NAMES SECTION */}
              <div className="mb-5">
                <h2 className={`${parisienne.className} text-5xl md:text-6xl text-slate-900 `}>
                  Henok berhane & Tsion g/tensae
                </h2>
                <p className="text-lg md:text-xl font-light text-slate-800" style={{ fontFamily: 'Noto Serif Ethiopic' }}>
                  ሄኖክ ብርሀኔ & ፅዮን ገ/ትንሳኤ
                </p>
              </div>

              {/* MAIN LETTER CONTENT */}
              <div className="max-w-lg mx-auto">
                <p className="text-base md:text-lg font-medium text-slate-900 leading-relaxed" style={{ fontFamily: 'Noto Serif Ethiopic' }}>
                  ውድ ቤተሰቦቻችን እና ጓደኞቻችን
                </p>

                <p className="text-sm md:text-base font-light text-slate-700 leading-[2]" style={{ fontFamily: 'Noto Serif Ethiopic' }}>
                  እነሆ ልዑል እግዚአብሔር ፈቅዶ የጋብቻችንን ሥነ-ሥርዓት ለመፈጸም ተቃርበናል። በመሆኑም ከታች በተጠቀሰው ጊዜና ቦታ ተገኝታችሁ የደስታችን ተካፋይ እንዲሆኑ ስንጋብዝዎት በታላቅ ደስታ ነው።
                </p>

                <p className="text-sm md:text-base font-light text-slate-700 leading-[2] italic" style={{ fontFamily: 'Noto Serif Ethiopic' }}>
                  የማይደገም እና የማይረሳ ቀናችንን ከእኛ ጋር ቢያሳልፉ ደስታችን እጥፍ ድርብ ነው።
                </p>
              </div>

              {/* --- COUNTER DESIGN --- */}
              {/* <div className="flex justify-center gap-8 mt-12 py-8 border-y border-slate-100">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-slate-900">{timeLeft.days}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Days</span>
                </div>
                <div className="text-center">
                  <span className="block text-3xl font-bold text-slate-900">{timeLeft.hours}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Hours</span>
                </div>
                <div className="text-center">
                  <span className="block text-3xl font-bold text-slate-900">{timeLeft.mins}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Minutes</span>
                </div>
              </div> */}

              {/* DATE & LOCATION INFO */}
              <div className="mt-5 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm tracking-[0.2em] text-slate-600 font-semibold uppercase" style={{ fontFamily: 'Noto Serif Ethiopic' }}>
                    ግንቦት ፳፫ ቀን ፪፲፻፲፰ ዓ.ም
                  </p>
                  <p className="text-xs text-stone-500 tracking-[0.3em] uppercase">
                    Saternday, May 30, 2026
                  </p>
                </div>
                <p className="text-xs text-stone-400 tracking-wider">Addis Ababa, Ethiopia</p>
              </div>
            </div>
          </motion.div>
         </main>
        {/* <div className="h-screen" /> */}
        <WeddingGallerySequence images={galleryImages} accent={accent} />


        <EthiopianCalendar />

          {/* Thank You & QR Code Section */}
        <section className="relative z-50 bg-black py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            
            {/* Guest Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <p className="text-xs tracking-[0.4em] uppercase text-white/40 mb-3">Dear Guest</p>
              <h3 className={`${parisienne.className} text-4xl md:text-5xl text-white`}>
                {data.guestName || "Honored Guest"}
              </h3>
            </motion.div>

            {/* Thank You Letter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
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

            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
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
              <p className="mt-4 text-xs tracking-[0.3em] uppercase text-white/40">
                Scan to RSVP
              </p>
            </motion.div>

            {/* Final Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
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
              
              {/* Decorative Element */}
              <div className="mt-12 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-white/20" />
                <span style={{ color: accent }} className="text-2xl">&#10084;</span>
                <div className="h-px w-12 bg-white/20" />
              </div>
            </motion.div>

          </div>
        </section>

      </div>


    </div>
  );
}