"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Lora, Inter, Noto_Sans_Ethiopic } from 'next/font/google';
import { TemplateProps } from '../type/wedding';
import backgroundImg from '@/public/download.jpg';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'], style: ['italic', 'normal'] });
const lora = Lora({ subsets: ['latin'], weight: ['400', '500'], style: ['italic', 'normal'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });
const notoEthiopic = Noto_Sans_Ethiopic({ subsets: ['ethiopic'], weight: ['300', '400', '700'] });

export default function TemplateOne({ data }: TemplateProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const rsvpValue = data.rsvpLink || "https://yourweddingwebsite.com";
  const displayImages = data.images?.length > 0 ? data.images : [
    "https://images.unsplash.com/photo-1520856729845-cee33a465223?q=80&w=2070",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069"
  ];
  
  const schedule = data.schedule || [
    { time: "09:00 AM", event: "የተባረከ ሥነ-ሥርዓት (Church Service)" },
    { time: "12:30 PM", event: "ምሳ እና የእንኳን ደህና መጡ ግብዣ" },
    { time: "04:00 PM", event: "የቁርስ እና የኬክ ሥነ-ሥርዓት" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(data.weddingDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDate]);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrentImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slider);
  }, [displayImages.length]);

  // REFINED ANIMATION VARIANTS
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.2 } },
    viewport: { once: true }
  };

  const itemFade = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <div className={`bg-white text-stone-800 overflow-x-hidden selection:bg-amber-100 ${lora.className}`}>
      
      {/* 1. HERO SECTION */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 2.5, ease: "easeOut" }} 
          className="absolute inset-0 z-0"
        >
          <Image 
            src={data.heroImage || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2070"} 
            alt="Hero Background" fill className="object-cover" priority 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        </motion.div>

        <section className="relative z-10 text-center text-white px-4">
          <motion.div 
            initial={{ opacity: 0, letterSpacing: "0.2em" }} 
            animate={{ opacity: 1, letterSpacing: "0.5em" }} 
            transition={{ duration: 1.5, delay: 0.5 }} 
            className="mb-6"
          >
            <span className={`text-amber-200 uppercase text-xs ${inter.className}`}>የጋብቻ ጥሪ</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`text-6xl md:text-8xl mb-6 text-[#D4AF77] drop-shadow-2xl ${notoEthiopic.className}`}
          >
            {data.names}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1, delay: 1.4 }}
            className={`text-xl md:text-2xl tracking-[0.2em] font-light ${notoEthiopic.className}`}
          >
            {new Date(data.weddingDate).toLocaleDateString('am-ET', { month: 'long', day: 'numeric', year: 'numeric' })}
          </motion.p>
        </section>

        <div className='absolute bottom-0 w-full h-auto bg-gradient-to-t from-black/60 to-transparent pb-10'>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="text-center px-4"
          >
            <div className="relative max-w-2xl mx-auto">
              <blockquote className="space-y-4 relative z-10">
                <p className={`text-lg md:text-2xl leading-relaxed text-amber-100 italic ${notoEthiopic.className}`}>
                  "ሙሽራይቱ ያለችው እርሱ ሙሽራ ነው፤ ቆሞ የሚሰማው ሚዜው ግን በሙሽራው ድምጽ እጅግ ደስ ይለዋል።"
                </p>
                <footer className={`text-amber-500 tracking-widest font-bold text-xs ${inter.className}`}>ዮሐንስ 3:29 | JOHN 3:29</footer>
              </blockquote>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="relative">
        {/* 2. INVITATION LETTER */}
        <section className="relative max-w-4xl mx-auto p-3">
          <Image src={backgroundImg} alt="background" priority className="w-full" />
          <motion.div 
            {...fadeInUp}
            className="text-center px-6 absolute top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full  z-10 "
          >
            <h2 className="text-[#5C2B2B] font-bold text-xl  text-right">ውድ ቤተሰቦቻችን እና ጓደኞቻችን</h2>
            <motion.div 
               initial={{ width: 0 }} 
               whileInView={{ width: 96 }} 
               transition={{ duration: 1, delay: 0.5 }}
               className="bg-[#D4AF77] mx-auto mb-6 h-[2px]" 
            />
           <p className="text-black font-light ">
      እነሆ ልዑል እግዚአብሔር ፈቅዶ የጋብቻችንን ሥነ-ሥርዓት ለመፈጸም
      ተቃርበናል። በመሆኑም ከታች በተጠቀሰው ጊዜና ቦታ ተገኝታችሁ
      የደስታችን ተካፋይ እንዲሆኑ ስንጋብዝዎት በታላቅ ደስታ ነው።
    </p>

            <p className={`text-lg text-[#5C2B2B] font-bold ${notoEthiopic.className}`}>
              አቶ አቤል <br />እና <br /> ዶ.ር ፍሬሕይወት
            </p>
          </motion.div>
        </section>

        {/* 3. IMAGE GALLERY */}
        <section className="py-20">
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto px-6">
            <h2 className={`text-center text-4xl mb-12 text-[#5C2B2B] ${playfair.className}`}>Our Captured Love</h2>
            <div className="relative h-[400px] md:h-[600px] rounded-[40px] overflow-hidden shadow-2xl border-[10px] md:border-[15px] border-white">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentImage} 
                  initial={{ opacity: 0, scale: 1.1 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }} 
                  transition={{ duration: 1.2, ease: "easeInOut" }} 
                  className="absolute inset-0"
                >
                  <Image src={displayImages[currentImage]} alt="Gallery" fill className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        {/* 4. LOGISTICS HUB */}
        <section className="py-32 px-6 bg-[#FFFCF9] relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            
            {/* Schedule with Staggered Items */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-12"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <motion.div 
                  variants={itemFade}
                  className="w-full md:w-1/3 aspect-[3/4] rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-[-2deg]"
                >
                  <Image src={data.groomImage || "https://images.unsplash.com/photo-1550005814-4284897d744e?q=80&w=1887"} alt="Groom" fill className="object-cover" />
                </motion.div>
                <motion.div variants={itemFade} className="flex-1 w-full bg-white p-8 rounded-[2rem] shadow-sm border border-[#D4AF77]/20">
                  <h3 className={`text-2xl text-[#5C2B2B] mb-6 border-b border-amber-100 pb-2 ${notoEthiopic.className}`}>የሰርግ መርሃ-ግብር</h3>
                  <div className="space-y-6">
                    {schedule.map((item, i) => (
                      <motion.div key={i} variants={itemFade} className="flex gap-4">
                        <span className={`text-[#D4AF77] font-bold text-sm ${inter.className}`}>{item.time}</span>
                        <p className={`text-stone-600 text-sm md:text-base ${notoEthiopic.className}`}>{item.event}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Countdown & Map */}
            <motion.div {...fadeInUp} className="lg:col-span-5 space-y-8">
              <div className="bg-[#5C2B2B] p-10 rounded-[2.5rem] shadow-xl text-white">
                <h4 className={`text-center text-amber-200 text-xs tracking-widest uppercase mb-8 ${inter.className}`}>የቀረ መዓልት</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'ቀን', value: timeLeft.days },
                    { label: 'ሰዓት', value: timeLeft.hours },
                    { label: 'ደቂቃ', value: timeLeft.minutes },
                    { label: 'ሰከንድ', value: timeLeft.seconds }
                  ].map((t, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 + 0.5 }}
                      className="text-center"
                    >
                      <div className={`text-3xl font-bold text-white ${notoEthiopic.className}`}>{String(t.value).padStart(2, '0')}</div>
                      <div className="text-[10px] text-amber-400/80 uppercase mt-2">{t.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-[2.5rem] shadow-lg border border-[#D4AF77]/30 overflow-hidden">
                <div className="h-64 w-full rounded-[2rem] overflow-hidden relative">
                  <iframe width="100%" height="100%" style={{ border: 0 }} src={`https://maps.google.com/maps?q=${encodeURIComponent(data.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-24 text-center bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="text-[#D4AF77] text-3xl mb-4">✙</div>
          <p className={`text-3xl font-light italic text-[#5C2B2B] mb-2 ${playfair.className}`}>With Eternal Love,</p>
          <p className={`text-xl tracking-widest text-[#D4AF77] ${notoEthiopic.className}`}>{data.names}</p>
        </motion.div>
      </footer>
    </div>
  );
}