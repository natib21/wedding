"use client";

import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";
import type { WeddingData } from "@/components/type/wedding";
import { getDirectionsUrl, getMapEmbedUrl, getVenueFromData } from "@/lib/weddingVenue";

type WeddingVenueMapProps = {
  data: WeddingData;
  accent?: string;
};

export default function WeddingVenueMap({ data, accent = "#e1ff00" }: WeddingVenueMapProps) {
  const { locationName, location, coordinates } = getVenueFromData(data);
  const embedUrl = getMapEmbedUrl(coordinates.lat, coordinates.lng);
  const directionsUrl = getDirectionsUrl(
    coordinates.lat,
    coordinates.lng,
    `${locationName}, ${location}`,
  );

  return (
    <section className="relative z-50 bg-black py-16 md:py-24 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8 md:mb-10">
          <p className="text-[10px] tracking-[0.45em] uppercase text-white/40 mb-3">Venue</p>
          <h2
            className="text-2xl md:text-3xl font-light text-white mb-2"
            style={{ fontFamily: "'Noto Serif Ethiopic', serif" }}
          >
            የሥነ ሥርዓቱ ቦታ
          </h2>
          <p className="text-sm tracking-[0.25em] uppercase text-white/50">Find us on the map</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-950"
        >
          <div className="relative aspect-[4/3] md:aspect-[16/10] w-full min-h-[260px] bg-neutral-900">
            <iframe
              title={`Map: ${locationName}`}
              src={embedUrl}
              className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10" aria-hidden />
          </div>

          <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/10">
            <div className="flex gap-3 text-left">
              <MapPin className="shrink-0 mt-0.5" size={20} style={{ color: accent }} aria-hidden />
              <div>
                <p className="text-white font-medium tracking-wide">{locationName}</p>
                <p className="text-sm text-white/55 mt-1">{location}</p>
              </div>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-90 shrink-0"
              style={{ backgroundColor: accent, color: "#0a0a0a" }}
            >
              Get directions
              <ExternalLink size={14} aria-hidden />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
