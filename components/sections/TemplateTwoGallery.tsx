"use client";

import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { BLUR_DATA_URL } from "@/lib/imagePlaceholder";
import { TEMPLATE_TWO_GALLERY_IMAGES } from "@/lib/weddingImageUrls";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"] });

export default function TemplateTwoGallery() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 ">
        <h2 className={`text-5xl text-white ${playfair.className}`}>Moments of Love</h2>
      </div>

      <div className="h-[620px] flex items-center relative overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory px-6 md:px-10">
        <div className="flex gap-10">
          {TEMPLATE_TWO_GALLERY_IMAGES.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative min-w-[300px] md:min-w-[450px] aspect-[4/5] overflow-hidden shadow-2xl border border-white/10 snap-center shrink-0 bg-neutral-900"
            >
              <Image
                src={src}
                alt={`Memory ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 300px, 450px"
                priority={i < 2}
                loading={i < 2 ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 text-white pointer-events-none">
                <p className="text-xs tracking-widest opacity-60">
                  MEMORY {String(i + 1).padStart(2, "0")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
