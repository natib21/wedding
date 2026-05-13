
"use client";

import React, { useState, useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useAnimationFrame,
  useMotionValue
} from 'framer-motion';
import { Playfair_Display, Lora, Inter, Noto_Sans_Ethiopic } from 'next/font/google';
import { TemplateProps } from '@/components/type/wedding';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'], style: ['italic', 'normal'] });
const lora = Lora({ subsets: ['latin'], weight: ['400', '500'], style: ['italic', 'normal'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });
const notoEthiopic = Noto_Sans_Ethiopic({ subsets: ['ethiopic'], weight: ['300', '400', '700'] });

const galleryImages = [
  "/images/gallery/1H7A0007.JPG",
  "/images/gallery/1H7A0015.JPG",
  "/images/gallery/1H7A0051.JPG",
  "/images/gallery/1H7A0057.JPG",
  "/images/gallery/1H7A0063.JPG",
  "/images/gallery/1H7A0094.JPG",
  "/images/gallery/1H7A0114.JPG",
  "/images/gallery/1H7A0199.JPG",
  "/images/gallery/1H7A0238.JPG",
  "/images/gallery/1H7A0250.JPG",
  "/images/gallery/1H7A0413.JPG",
  "/images/gallery/1H7A0460.JPG",
  "/images/gallery/1H7A0476.JPG",
  "/images/gallery/1H7A9778.JPG",
  "/images/gallery/1H7A9877.JPG",
  "/images/gallery/1H7A9953.JPG",
  "/images/gallery/1H7A9963.JPG",
  "/images/gallery/1H7A9995.JPG",
];

export default function TemplateTwo({ data }: TemplateProps) {
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [gatekeeperMode, setGatekeeperMode] = useState(false);
  const [isHoveringGallery, setIsHoveringGallery] = useState(false);
  const router = useRouter();

  const galleryRef = useRef<HTMLDivElement>(null);

  // 1. Vertical to Horizontal Scrub Logic
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });

  const xTranslation = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const springX = useSpring(xTranslation, { stiffness: 50, damping: 20 });

  // 2. Auto-scroll logic
  const autoX = useMotionValue(0);
  useAnimationFrame(() => {
    if (!isHoveringGallery) {
      autoX.set(autoX.get() - 0.5); // Constant smooth drift
      if (autoX.get() < -2000) autoX.set(0); // Simple loop reset
    }
  });

  // Combine both values
  const combinedX = useTransform([springX, autoX], ([latestSpring, latestAuto]) => {
    return Number(latestSpring) + Number(latestAuto);
  });

  const handleCheckIn = async () => {
    if (!data.slug) return;
    setIsCheckingIn(true);
    try {
      const res = await fetch('/api/invites/check-in', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: data.slug }),
      });
      if (res.ok) {
        alert('Entrance Verified');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const qrUrl = data.slug
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${data.slug}`
    : (data.rsvpLink || "");

  return (
    <div className={`bg-[#0a0a0a] text-stone-200 overflow-x-hidden selection:bg-amber-500/30 ${lora.className}`}>

      {/* 0. GATEKEEPER UI */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setGatekeeperMode(!gatekeeperMode)}
          className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 p-3 rounded-full text-[9px] uppercase tracking-[0.3em] text-stone-500 transition-all"
        >
          {gatekeeperMode ? 'ADMIN MODE: ON' : 'GATE ACCESS'}
        </button>
      </div>

      {/* 1. CINEMATIC HERO */}
      <header className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/gallery/1H7A0334.JPG"
            alt="Hero Background"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]" />
        </motion.div>

        <section className="relative z-10 text-center px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <span className={`text-amber-500/80 uppercase text-xs tracking-[0.6em] mb-10 block ${inter.className}`}>
              We Are Getting Married
            </span>
            <h1 className={`text-7xl md:text-9xl mb-12 leading-none text-white drop-shadow-2xl ${notoEthiopic.className}`}>
              {data.names}
            </h1>
            <div className="flex items-center justify-center gap-6">
              <span className="h-[1px] w-20 bg-gradient-to-r from-transparent to-amber-500/50" />
              <p className={`text-xl md:text-2xl tracking-[0.3em] font-light text-amber-100/90 ${playfair.className} italic`}>
                {new Date(data.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <span className="h-[1px] w-20 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
          </motion.div>
        </section>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-30"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </header>

      {/* 2. SCRIPTURE & INVITATION */}
      <section className="py-40 px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <p className={`text-3xl md:text-5xl leading-relaxed text-stone-100 italic ${notoEthiopic.className}`}>
              &ldquo;ሙሽራይቱ ያለችው እርሱ ሙሽራ ነው፤ ቆሞ የሚሰማው ሚዜው ግን በሙሽራው ድምጽ እጅግ ደስ ይለዋል።&rdquo;
            </p>
            <p className={`text-amber-500/60 tracking-[0.4em] text-sm font-bold ${inter.className}`}>ዮሐንስ 3:29 | JOHN 3:29</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-8 pt-20 border-t border-white/5"
          >
            <h2 className={`text-2xl text-stone-400 uppercase tracking-[0.2em] ${notoEthiopic.className}`}>ክቡር ግብዣ</h2>
            <p className={`text-xl md:text-2xl text-stone-300 leading-relaxed font-light ${notoEthiopic.className}`}>
              እነሆ ልዑል እግዚአብሔር ፈቅዶ የጋብቻችንን ሥነ-ሥርዓት ለመፈጸም ተቃርበናል። በመሆኑም ከታች በተጠቀሰው ጊዜና ቦታ ተገኝታችሁ የደስታችን ተካፋይ እንዲሆኑ ስንጋብዝዎት በታላቅ ደስታ ነው።
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. ADVANCED HORIZONTAL GALLERY (Awwwards Style) */}
      <section ref={galleryRef} className="py-20 bg-[#0f0f0f] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={`text-5xl md:text-7xl text-white ${playfair.className}`}
          >
            Our Captured Story
          </motion.h2>
          <div className="w-20 h-[2px] bg-amber-500 mt-6" />
        </div>

        <div
          onMouseEnter={() => setIsHoveringGallery(true)}
          onMouseLeave={() => setIsHoveringGallery(false)}
          className="relative h-[600px] flex items-center"
        >
          <motion.div
            style={{ x: combinedX }}
            drag="x"
            dragConstraints={{ left: -5000, right: 0 }}
            className="flex gap-8 px-[10vw]"
          >
            {galleryImages.map((src, i) => (
              <motion.div
                key={i}
                className="relative min-w-[350px] md:min-w-[500px] aspect-[4/5] rounded-[3.5rem] overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10"
                whileHover={{ scale: 1.02, y: -10 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <Image
                  src={src}
                  alt={`Moment ${i}`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-w-768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-10 left-10 text-white">
                  <p className={`text-[10px] tracking-[0.4em] uppercase mb-1 opacity-50 ${inter.className}`}>MOMENT</p>
                  <p className={`text-2xl ${playfair.className}`}>NO. {i + 1}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="max-w-7xl mx-auto px-6 mt-20 flex justify-center">
          <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 bg-amber-500 origin-left"
            />
          </div>
        </div>
      </section>

      {/* 4. DETAILS & LOGISTICS */}
      <section className="py-40 px-6 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

          <div className="space-y-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className={`text-4xl text-white ${playfair.className}`}>The Celebration</h3>
              <p className="text-amber-500/60 uppercase tracking-[0.3em] text-[10px]">Logistics & Schedule</p>
            </motion.div>

            <div className="space-y-12">
              {(data.schedule || []).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex items-start gap-8 border-l border-white/5 pl-8 hover:border-amber-500/50 transition-colors"
                >
                  <span className="text-amber-500 font-bold text-xs pt-1 tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity">
                    {item.time}
                  </span>
                  <div>
                    <p className={`text-2xl text-stone-200 group-hover:text-white transition-colors ${notoEthiopic.className}`}>
                      {item.event}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-2 tracking-widest uppercase">Venue Protocol Attached</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Secure QR / Entrance Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative p-1 bg-[#121212] rounded-[4rem] border border-white/5 shadow-2xl"
          >
            <div className="bg-[#1a1a1a] rounded-[3.8rem] p-16 flex flex-col items-center">
              <h3 className={`text-xl text-stone-400 mb-10 tracking-[0.2em] uppercase ${inter.className}`}>Entrance Identity</h3>

              <div className="relative group p-8 bg-white rounded-[3.5rem] shadow-[0_0_80px_rgba(255,255,255,0.05)] border-8 border-stone-800/50">
                {isMounted && qrUrl && (
                  <QRCodeSVG value={qrUrl} size={220} bgColor="#ffffff" fgColor="#000000" level="H" />
                )}
                <div className="absolute -inset-4 border border-white/5 rounded-[4rem] pointer-events-none group-hover:scale-105 transition-transform duration-500" />
              </div>

              <div className="mt-12 text-center space-y-4">
                <p className={`text-2xl text-white ${notoEthiopic.className}`}>{data.guestName || "Guest"}</p>
                <p className="text-[9px] text-stone-500 tracking-[0.4em] uppercase max-w-[200px] leading-relaxed mx-auto">
                  Digital Pass for Official Entry Verification
                </p>
              </div>

              {gatekeeperMode && data.status === 'pending' && (
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="mt-12 w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-amber-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isCheckingIn ? 'VERIFYING...' : 'AUTHORIZE ENTRY'}
                </button>
              )}

              {data.status === 'attended' && (
                <div className="mt-12 flex items-center gap-3 px-8 py-4 bg-emerald-500/10 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-500/20">
                  <span className="text-sm">✓</span> Identity Verified
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. LUXURY FOOTER */}
      <footer className="relative py-40 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-900 via-black to-black opacity-40" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-16">
          <div className="text-amber-500/40 text-4xl">✙</div>
          <p className={`text-4xl md:text-6xl italic text-white ${playfair.className}`}>With Eternal Devotion,</p>
          <div className="space-y-4">
            <p className={`text-2xl md:text-3xl tracking-[0.5em] uppercase font-light text-stone-400 ${inter.className}`}>
              {data.names}
            </p>
            <p className="text-stone-600 text-[10px] tracking-[0.8em] uppercase pt-4">ADDIS ABABA — 2026</p>
          </div>
          <div className="pt-20 opacity-20 hover:opacity-100 transition-opacity duration-500">
            <div className="w-[1px] h-20 bg-white mx-auto" />
          </div>
        </div>
      </footer>
    </div>
  );
}
